using Azure.Messaging.ServiceBus;
using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.v1;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Submission.Models.v1;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using RIPA.Functions.Submission.Utility;
using System;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using static RIPA.Functions.Submission.Services.ServiceBus.SubmissionServiceBusService;

namespace RIPA.Functions.Submission.Functions.v1;

public class TimersSubmissionConsumer
{
    private readonly IStopCosmosDbService<Stop> _stopCosmosDbService;
    private readonly ISftpService _sftpService;
    private readonly IStopService<Stop> _stopService;
    readonly ISubmissionServiceBusService _submissionServiceBusService;
    private readonly string _storageConnectionString;
    private readonly string _storageContainerNamePrefix;
    private readonly string _sftpInputPath;
    private readonly BlobContainerClient _blobContainerClient;
    private readonly BlobUtilities blobUtilities = new BlobUtilities();

    public TimersSubmissionConsumer(IStopCosmosDbService<Stop> stopCosmosDbService, ISftpService sftpService, IStopService<Stop> stopService, ISubmissionServiceBusService submissionServiceBusService)
    {
        _stopCosmosDbService = stopCosmosDbService;
        _sftpService = sftpService;
        _stopService = stopService;
        _submissionServiceBusService = submissionServiceBusService;
        _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
        _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixSubmissions");
        _sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");
        _blobContainerClient = GetBlobContainerClient();
    }

    [FunctionName("TimersSubmissionConsumer")]
    public async Task Run([TimerTrigger("*/10 * * * * *")] TimerInfo myTimer, ILogger log)
    {
        Stopwatch runStopwatch = new Stopwatch();
        runStopwatch.Start();

        string runId = Guid.NewGuid().ToString();

        log.LogInformation($"TimersSubmissionConsumer function executing: {runId}");

        ServiceBusReceiver serviceBusReceiver = _submissionServiceBusService.SubmissionServiceBusClient.CreateReceiver("submission");
        var messages = await _submissionServiceBusService.ReceiveMessagesAsync(serviceBusReceiver);

        log.LogInformation($"Received message count: {messages.Count} : {runId}");

        foreach (var message in messages)
        {
            Stopwatch stopStopwatch = new Stopwatch();
            stopStopwatch.Start();

            await serviceBusReceiver.RenewMessageLockAsync(message);

            SubmissionMessage submissionMessage = DeserializeQueueItem(log, Encoding.UTF8.GetString(message.Body));

            if (submissionMessage == null)
            {
                await serviceBusReceiver.DeadLetterMessageAsync(message);

                continue;
            }

            // Get Stop
            Stop stop = await GetStop(log, submissionMessage.StopId, runId);

            if (stop == null)
            {
                log.LogWarning($"Failed to find stop: {submissionMessage.StopId} : {runId}");
                await serviceBusReceiver.AbandonMessageAsync(message); // allows for retry to occur. 

                continue;
            }

            DateTime dateSubmitted = DateTime.UtcNow;

            // Get File Name
            string fileName = GetFileName(log, submissionMessage.SubmissionId, dateSubmitted, stop.Ori, stop.Id, runId);
            log.LogInformation($"Using filename: {fileName} : {runId}");
            if (fileName == null)
            {
                await serviceBusReceiver.AbandonMessageAsync(message); // allows for retry to occur. 

                continue;
            }

            // Get Doj Stop
            DojStop dojStop = GetDojStop(log, stop, runId);

            if (dojStop == null)
            {
                // if the cast error fails report, retry the message
                if (!await HandledDojCastError(log, stop, dateSubmitted, fileName, submissionMessage.SubmissionId, runId))
                {
                    await serviceBusReceiver.AbandonMessageAsync(message); // allows for retry to occur. 

                    continue;
                }
                else
                {
                    await serviceBusReceiver.CompleteMessageAsync(message); // message complete

                    continue;
                }
            }

            //Get File Bytes
            byte[] bytes = GetFileBytes(log, dojStop, runId);

            if (bytes == null)
            {
                log.LogWarning($"Failed to get file contents: {dojStop.LEARecordID} : {runId}");
                await serviceBusReceiver.AbandonMessageAsync(message); // allows for retry to occur. 

                continue;
            }

            //Upload Blob
            if (!await UploadBlob(log, bytes, fileName, stop.Id, runId))
            {
                log.LogWarning($"Failed to upload blob: {stop.Id} : {runId}");
                await serviceBusReceiver.AbandonMessageAsync(message); // allows for retry to occur. 

                continue;
            }

            if (!await UploadSftpFile(log, bytes, fileName, stop.Id, runId, stop))
            {
                log.LogWarning($"Failed to upload to FTP: {stop.Id} : {runId}");
                await RemoveBlob(log, fileName, stop.Id, runId); // delete the blob to clean up the failed run
                await serviceBusReceiver.AbandonMessageAsync(message); // allows for retry to occur. 

                continue;
            }

            if (!await HandleDojSubmitSuccess(log, stop, dateSubmitted, submissionMessage.SubmissionId, fileName, runId))
            {
                log.LogWarning($"Failed to handle doj submit success: {stop.Id} : {runId}");
                RemoveSftpFile(log, fileName, stop.Id, runId); // remove the file from the SFTP server so it doesnt get duplicated. 
                await serviceBusReceiver.AbandonMessageAsync(message); // allows for retry to occur. 

                continue;
            }

            await serviceBusReceiver.CompleteMessageAsync(message); // message complete

            stopStopwatch.Stop();
            log.LogInformation($"Finished processing STOP : {stop.Id} : {stopStopwatch.ElapsedMilliseconds} : {runId}");
        }

        runStopwatch.Stop();
        log.LogInformation($"TimersSubmissionConsumer finished: {runStopwatch.ElapsedMilliseconds} : {runId}");
    }

    public BlobContainerClient GetBlobContainerClient()
    {
        BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
        string containerName = $"{_storageContainerNamePrefix}";
        BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
        return blobContainerClient;
    }

    private static SubmissionMessage DeserializeQueueItem(ILogger log, string myQueueItem)
    {
        try
        {
            return JsonConvert.DeserializeObject<SubmissionMessage>(myQueueItem);
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during deserializing myQueueItem. Sent to Deadletter queue message: {myQueueItem} ");
            return null;
        }
    }

    private async Task<Stop> GetStop(ILogger log, string id, string runId)
    {
        try
        {
            log.LogInformation($"GetStop: {id} : {runId}");
            return await _stopCosmosDbService.GetStopAsync(id);
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during GetStop with id {id} : {runId}");
            return null;
        }
    }

    private static string GetFileName(ILogger log, Guid submissionId, DateTime date, string ori, string stopId, string runId)
    {
        try
        {
            return $"{date.ToString("yyyyMMdd")}/{submissionId}/{date:yyyyMMddHHmmss}_{ori}_{stopId}.json";
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during GetFileName with id {stopId} : {runId}");
            return null;
        }
    }

    private DojStop GetDojStop(ILogger log, Stop stop, string runId)
    {
        try
        {
            log.LogInformation($"Casting Stop to DoJStop: {stop.Id} : {runId}");
            return _stopService.CastToDojStop(stop);
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during GetDojStop with id {stop.Id} : {runId}");
            return null;
        }
    }

    private async Task<bool> HandledDojCastError(ILogger log, Stop stop, DateTime date, string fileName, Guid submissionId, string runId)
    {
        try
        {
            log.LogWarning($"Handling DoJ Cast Error: {stop.Id} : {runId}");
            SubmissionError submissionError = new SubmissionError()
            {
                Code = "FTS",
                Message = "Failed to submit to DOJ. Stop to DOJ Cast failure",
                DateReported = date,
                ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.SubmissionError),
                FileName = fileName,
                SubmissionId = submissionId
            };
            await _stopCosmosDbService.UpdateStopAsync(_stopService.ErrorSubmission(stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during HandleDojCastError with stop id {stop.Id}");
            return false;
        }
    }

    private static byte[] GetFileBytes(ILogger log, DojStop dojStop, string runId)
    {
        try
        {
            log.LogInformation($"Getting file contents: {dojStop.LEARecordID} : {runId}");
            var settings = new JsonSerializerSettings() { ContractResolver = new NullToEmptyStringResolver() };
            return Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(dojStop, settings));
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during GetFileBytes with stop id {dojStop.LEARecordID} : {runId}");
            return null;
        }
    }

    private async Task<bool> UploadBlob(ILogger log, byte[] bytes, string fileName, string stopId, string runId)
    {
        try
        {
            log.LogInformation($"Uploading to blob: {stopId} : {runId}");
            await blobUtilities.UploadBlobJson(bytes, fileName, _blobContainerClient); //Upload json as Blob to Azure Storage Container 
            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during UploadBlob with stop id {stopId} : {runId}");
            return false;
        }
    }

    private async Task<bool> RemoveBlob(ILogger log, string fileName, string stopId, string runId)
    {
        try
        {
            log.LogInformation($"Removing blob: {stopId} : {runId}");
            await blobUtilities.DeleteBlobJson(fileName, _blobContainerClient);
            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during DeleteBlob with stop id {stopId} : {runId}");
            return false;
        }
    }

    private async Task<bool> UploadSftpFile(ILogger log, byte[] bytes, string fileName, string stopId, string runId, Stop stop)
    {
        try
        {
            log.LogInformation($"Uploading to FTP: {stopId} : {runId}");
            _sftpService.UploadStop(bytes, $"{_sftpInputPath}{fileName.Split("/")[2]}");
            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during UploadSftpFile with stop id {stopId} : {runId}");
            stop.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Unsubmitted);
            await _stopCosmosDbService.UpdateStopAsync(stop);
            return false;
        }
    }

    private bool RemoveSftpFile(ILogger log, string fileName, string stopId, string runId)
    {
        try
        {
            log.LogInformation($"Remving from FTP: {stopId} : {runId}");
            _sftpService.DeleteFile($"{_sftpInputPath}{fileName.Split("/")[2]}");
            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during DeleteSftpFile with stop id {stopId} : {runId}");
            return false;
        }
    }

    private async Task<bool> HandleDojSubmitSuccess(ILogger log, Stop stop, DateTime date, Guid submissionId, string fileName, string runId)
    {
        try
        {
            log.LogInformation($"Handling DoJ submission success: {stop.Id} : {runId}");
            await _stopCosmosDbService.UpdateStopAsync(_stopService.NewSubmission(stop, date, submissionId, fileName));
            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during update stop status stop id {stop.Id} : {runId}");
            return false;
        }
    }

    private async Task HandleFailedToSubmit(ILogger lod, DateTime date, string fileName, Guid submissionId, Stop stop)
    {
        try
        {
            SubmissionError submissionError = new SubmissionError()
            {
                Code = "FTS",
                Message = "Failed to submit to DOJ. SFTP connection, Blob Connection failure",
                DateReported = date,
                ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.SubmissionError),
                FileName = fileName,
                SubmissionId = submissionId
            };
            await _stopCosmosDbService.UpdateStopAsync(_stopService.ErrorSubmission(stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Unsubmitted)));
            return;
        }
        catch (Exception)
        {
            throw new Exception("Failed to update stop submission error");
        }
    }
}
