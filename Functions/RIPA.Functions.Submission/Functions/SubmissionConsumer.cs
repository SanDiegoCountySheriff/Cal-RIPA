using Azure.Messaging.ServiceBus;
using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.ServiceBus;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Submission.Models.Interfaces;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using RIPA.Functions.Submission.Utility;
using System;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using static RIPA.Functions.Submission.Services.ServiceBus.SubmissionServiceBusService;

namespace RIPA.Functions.Submission.Functions;

public class SubmissionConsumer
{
    private readonly IStopCosmosDbService<Common.Models.v1.Stop> _stopV1CosmosDbService;
    private readonly IStopCosmosDbService<Common.Models.v2.Stop> _stopV2CosmosDbService;
    private readonly ISftpService _sftpService;
    private readonly Services.REST.v1.Contracts.IStopService _stopV1Service;
    private readonly Services.REST.v2.Contracts.IStopService _stopV2Service;
    private readonly string _storageConnectionString;
    private readonly string _storageContainerNamePrefix;
    private readonly string _sftpInputPath;
    private readonly BlobContainerClient _blobContainerClient;
    private readonly BlobUtilities blobUtilities = new BlobUtilities();
    private readonly int _maxDeliveryAttempts;

    public SubmissionConsumer(
        IStopCosmosDbService<Common.Models.v1.Stop> stopV1CosmosDbService,
        IStopCosmosDbService<Common.Models.v2.Stop> stopV2CosmosDbService,
        ISftpService sftpService,
        Services.REST.v1.Contracts.IStopService stopV1Service,
        Services.REST.v2.Contracts.IStopService stopV2Service
    )
    {
        _stopV1CosmosDbService = stopV1CosmosDbService;
        _stopV2CosmosDbService = stopV2CosmosDbService;
        _sftpService = sftpService;
        _stopV1Service = stopV1Service;
        _stopV2Service = stopV2Service;
        _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
        _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixSubmissions");
        _sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");
        _blobContainerClient = GetBlobContainerClient();

        var maxDeliveryAttemptsRaw = Environment.GetEnvironmentVariable("SubmissionMaxDeliveryAttempts");
        _maxDeliveryAttempts = int.TryParse(maxDeliveryAttemptsRaw, out var parsedMax) && parsedMax > 0 ? parsedMax : 10;
    }

    [FunctionName("SubmissionConsumer")]
    public async Task Run(
        [ServiceBusTrigger("submission", Connection = "ServiceBusConnection")]
        ServiceBusReceivedMessage[] messages,
        ServiceBusMessageActions MessageActions,
        ILogger log)
    {
        Stopwatch runStopwatch = new Stopwatch();
        runStopwatch.Start();

        string runId = Guid.NewGuid().ToString();

        log.LogInformation($"TimersSubmissionConsumer function executing: {runId}");

        log.LogInformation($"Received message count: {messages.Length} : {runId}");

        ISftpBatch sftpBatch = null;

        try
        {
            foreach (var message in messages)
            {
                Stopwatch stopStopwatch = new Stopwatch();
                stopStopwatch.Start();

                SubmissionMessage submissionMessage = null;
                IStop stop = null;
                string fileName = null;

                try
                {
                    await MessageActions.RenewMessageLockAsync(message);

                    submissionMessage = DeserializeQueueItem(log, Encoding.UTF8.GetString(message.Body));

                    if (submissionMessage == null)
                    {
                        await MessageActions.DeadLetterMessageAsync(message);
                        continue;
                    }

                    // Get Stop
                    stop = await GetStop(log, submissionMessage.StopId, runId, submissionMessage.StopVersion);

                    if (stop == null)
                    {
                        log.LogWarning($"Failed to find stop: {submissionMessage.StopId} : {runId}");
                        await HandleFailureAsync(log, MessageActions, message, runId, "Stop not found", stop, submissionMessage.SubmissionId, fileName);
                        continue;
                    }

                    DateTime dateSubmitted = DateTime.UtcNow;

                    // Get File Name
                    fileName = GetFileName(log, submissionMessage.SubmissionId, dateSubmitted, stop.Ori, stop.Id, runId);
                    log.LogInformation($"Using filename: {fileName} : {runId}");
                    if (fileName == null)
                    {
                        await HandleFailureAsync(log, MessageActions, message, runId, "Failed to build file name", stop, submissionMessage.SubmissionId, fileName);
                        continue;
                    }

                    // Get Doj Stop
                    IDojStop dojStop = GetDojStop(log, stop, runId);

                    if (dojStop == null)
                    {
                        await HandleFailureAsync(log, MessageActions, message, runId, "Failed to convert stop to DOJ payload", stop, submissionMessage.SubmissionId, fileName);
                        continue;
                    }

                    //Get File Bytes
                    byte[] bytes = GetFileBytes(log, dojStop, runId);

                    if (bytes == null)
                    {
                        log.LogWarning($"Failed to get file contents: {dojStop.LEARecordID} : {runId}");
                        await HandleFailureAsync(log, MessageActions, message, runId, "Failed to serialize DOJ stop", stop, submissionMessage.SubmissionId, fileName);
                        continue;
                    }

                    //Upload Blob
                    if (!await UploadBlob(log, bytes, fileName, stop.Id, runId))
                    {
                        log.LogWarning($"Failed to upload blob: {stop.Id} : {runId}");
                        await HandleFailureAsync(log, MessageActions, message, runId, "Blob upload failed", stop, submissionMessage.SubmissionId, fileName);
                        continue;
                    }

                    sftpBatch = await EnsureSftpBatchAsync(sftpBatch, log, runId);
                    if (!await UploadSftpFile(log, sftpBatch, bytes, fileName, stop.Id, runId, stop))
                    {
                        log.LogWarning($"Failed to upload to FTP. Reconnecting and retrying once: {stop.Id} : {runId}");
                        await RemoveBlob(log, fileName, stop.Id, runId); // delete the blob to clean up the failed run

                        sftpBatch.Dispose();
                        sftpBatch = await EnsureSftpBatchAsync(null, log, runId);

                        if (!await UploadSftpFile(log, sftpBatch, bytes, fileName, stop.Id, runId, stop))
                        {
                            await HandleFailureAsync(log, MessageActions, message, runId, "SFTP upload failed", stop, submissionMessage.SubmissionId, fileName);
                            continue;
                        }
                    }

                    if (!await HandleDojSubmitSuccess(log, stop, dateSubmitted, submissionMessage.SubmissionId, fileName, runId))
                    {
                        log.LogWarning($"Failed to handle doj submit success: {stop.Id} : {runId}");
                        await RemoveSftpFile(log, fileName, stop.Id, runId); // remove the file from the SFTP server so it doesnt get duplicated.
                        await HandleFailureAsync(log, MessageActions, message, runId, "Failed to persist DOJ submit success", stop, submissionMessage.SubmissionId, fileName);
                        continue;
                    }

                    await MessageActions.CompleteMessageAsync(message); // message complete

                    stopStopwatch.Stop();
                    log.LogInformation($"Finished processing STOP : {stop.Id} : {stopStopwatch.ElapsedMilliseconds} : {runId}");
                }
                catch (Exception ex)
                {
                    await HandleFailureAsync(log, MessageActions, message, runId, "Unhandled exception while processing message", stop, submissionMessage?.SubmissionId ?? Guid.Empty, fileName, ex);
                }
            }
        }
        finally
        {
            sftpBatch?.Dispose();
        }

        runStopwatch.Stop();
        log.LogInformation($"TimersSubmissionConsumer finished: {runStopwatch.ElapsedMilliseconds} : {runId}");
    }

    private async Task<ISftpBatch> EnsureSftpBatchAsync(ISftpBatch sftpBatch, ILogger log, string runId)
    {
        if (sftpBatch != null)
        {
            return sftpBatch;
        }

        log.LogInformation("Opening SFTP batch connection for submission run {runId}", runId);
        return await _sftpService.BeginBatch();
    }

    private bool IsFinalAttempt(ServiceBusReceivedMessage message)
    {
        return message.DeliveryCount >= _maxDeliveryAttempts;
    }

    private async Task HandleFailureAsync(
        ILogger log,
        ServiceBusMessageActions messageActions,
        ServiceBusReceivedMessage message,
        string runId,
        string reason,
        IStop stop,
        Guid submissionId,
        string fileName,
        Exception ex = null)
    {
        if (ex != null)
        {
            log.LogError(ex, "Submission processing failure. reason={reason} stopId={stopId} deliveryCount={deliveryCount}/{max} runId={runId}", reason, stop?.Id, message.DeliveryCount, _maxDeliveryAttempts, runId);
        }
        else
        {
            log.LogWarning("Submission processing failure. reason={reason} stopId={stopId} deliveryCount={deliveryCount}/{max} runId={runId}", reason, stop?.Id, message.DeliveryCount, _maxDeliveryAttempts, runId);
        }

        if (stop != null && submissionId != Guid.Empty)
        {
            try
            {
                await HandleFailedToSubmit(log, DateTime.UtcNow, fileName ?? string.Empty, submissionId, stop);
            }
            catch (Exception statusEx)
            {
                log.LogError(statusEx, "Failed to revert stop status to Unsubmitted for stopId={stopId} runId={runId}", stop.Id, runId);
            }
        }

        if (IsFinalAttempt(message))
        {
            var deadLetterReason = "SubmissionProcessingRetryExhausted";
            var deadLetterDescription = $"reason={reason};stopId={stop?.Id};delivery={message.DeliveryCount}/{_maxDeliveryAttempts};runId={runId}";
            await messageActions.DeadLetterMessageAsync(message, deadLetterReason, deadLetterDescription);
            log.LogWarning("Message dead-lettered after retry exhaustion. stopId={stopId} deliveryCount={deliveryCount}/{max} runId={runId}", stop?.Id, message.DeliveryCount, _maxDeliveryAttempts, runId);
            return;
        }

        await messageActions.AbandonMessageAsync(message);
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

    private async Task<IStop> GetStop(ILogger log, string id, string runId, int stopVersion)
    {
        try
        {
            log.LogInformation($"GetStop: {id} : {runId}");

            if (stopVersion == 2)
            {
                return await _stopV2CosmosDbService.GetStopAsync(id);
            }
            else
            {
                return await _stopV1CosmosDbService.GetStopAsync(id);
            }
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

    private IDojStop GetDojStop(ILogger log, IStop stop, string runId)
    {
        try
        {
            log.LogInformation($"Casting Stop to DoJStop: {stop.Id} : {runId}");

            if (stop.StopVersion == StopVersion.V2)
            {
                return _stopV2Service.CastToDojStop((Common.Models.v2.Stop)stop);
            }
            else
            {
                return _stopV1Service.CastToDojStop((Common.Models.v1.Stop)stop);
            }
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during GetDojStop with id {stop.Id} : {runId}");
            return null;
        }
    }

    private static byte[] GetFileBytes(ILogger log, IDojStop dojStop, string runId)
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

    private async Task<bool> UploadSftpFile(ILogger log, ISftpBatch sftpBatch, byte[] bytes, string fileName, string stopId, string runId, IStop stop)
    {
        try
        {
            log.LogInformation($"Uploading to FTP: {stopId} : {runId}");
            await sftpBatch.UploadStop(bytes, $"{_sftpInputPath}{fileName.Split("/")[2]}");
            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during UploadSftpFile with stop id {stopId} : {runId}");
            return false;
        }
    }

    private async Task<bool> RemoveSftpFile(ILogger log, string fileName, string stopId, string runId)
    {
        try
        {
            log.LogInformation($"Remving from FTP: {stopId} : {runId}");
            await _sftpService.DeleteFile($"{_sftpInputPath}{fileName.Split("/")[2]}");
            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during DeleteSftpFile with stop id {stopId} : {runId}");
            return false;
        }
    }

    private async Task<bool> HandleDojSubmitSuccess(ILogger log, IStop stop, DateTime date, Guid submissionId, string fileName, string runId)
    {
        try
        {
            log.LogInformation($"Handling DoJ submission success: {stop.Id} : {runId}: {date} : {submissionId} : {fileName}");

            if (stop.StopVersion == StopVersion.V2)
            {
                await _stopV2CosmosDbService.UpdateStopAsync(_stopV2Service.NewSubmission((Common.Models.v2.Stop)stop, date, submissionId, fileName));
            }
            else
            {
                await _stopV1CosmosDbService.UpdateStopAsync(_stopV1Service.NewSubmission((Common.Models.v1.Stop)stop, date, submissionId, fileName));
            }

            return true;
        }
        catch (Exception ex)
        {
            log.LogError($"Exception: {ex} --> occurred during update stop status stop id {stop.Id} : {runId}");
            return false;
        }
    }

    private async Task HandleFailedToSubmit(ILogger log, DateTime date, string fileName, Guid submissionId, IStop stop)
    {
        try
        {
            SubmissionError submissionError = new SubmissionError()
            {
                Code = "FTS",
                Message = "Failed to submit to DOJ. Submission processing failed.",
                DateReported = date,
                ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.SubmissionError),
                FileName = fileName,
                SubmissionId = submissionId
            };

            var isNfia = stop.Nfia == true;
            var errorStatus = isNfia ? SubmissionStatus.Unsubmitted_NFIA.ToString() : SubmissionStatus.Unsubmitted.ToString();

            if (stop.StopVersion == StopVersion.V2)
            {
                await _stopV2CosmosDbService.UpdateStopAsync(_stopV2Service.ErrorSubmission((Common.Models.v2.Stop)stop, submissionError, errorStatus));
            }
            else
            {
                await _stopV1CosmosDbService.UpdateStopAsync(_stopV1Service.ErrorSubmission((Common.Models.v1.Stop)stop, submissionError, errorStatus));
            }
            return;
        }
        catch (Exception)
        {
            throw new Exception("Failed to update stop submission error");
        }
    }
}
