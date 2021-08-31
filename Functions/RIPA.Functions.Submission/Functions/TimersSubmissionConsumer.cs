using System;
using System.Text;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Submission.Models;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using RIPA.Functions.Submission.Utility;
using static RIPA.Functions.Submission.Services.ServiceBus.SubmissionServiceBusService;

namespace RIPA.Functions.Submission.Functions
{
    public class TimersSubmissionConsumer
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly ISftpService _sftpService;
        private readonly IStopService _stopService;
        ISubmissionServiceBusService _submissionServiceBusService;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;
        private readonly string _sftpInputPath;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly BlobUtilities blobUtilities = new BlobUtilities();

        public TimersSubmissionConsumer(IStopCosmosDbService stopCosmosDbService, ISftpService sftpService, IStopService stopService, ISubmissionServiceBusService submissionServiceBusService)
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
        public async Task Run([TimerTrigger("*/10 * * * * *")]TimerInfo myTimer, ILogger log)
        {
            Guid run = Guid.NewGuid();
            log.LogInformation($"TimersSubmissionConsumer function executed at: {DateTime.Now} : {run.ToString()}");

            ServiceBusReceiver serviceBusReceiver = _submissionServiceBusService.SubmissionServiceBusClient.CreateReceiver("submission");
            foreach (var m in await _submissionServiceBusService.ReceiveMessagesAsync(serviceBusReceiver))
            {
                SubmissionMessage submissionMessage = DeserializeQueueItem(log, Encoding.UTF8.GetString(m.Body));

                if (submissionMessage == null)
                {
                    await serviceBusReceiver.DeadLetterMessageAsync(m);

                    continue;
                }

                //Get Stop
                Stop stop = await GetStop(log, submissionMessage.StopId);

                if (stop == null)
                {
                    log.LogWarning($"Failed to find stop: {submissionMessage.StopId}");
                    await serviceBusReceiver.AbandonMessageAsync(m); // allows for retry to occur. 

                    continue;
                }

                DateTime dateSubmitted = DateTime.UtcNow;

                //Get File Name
                string fileName = GetFileName(log, submissionMessage.SubmissionId, dateSubmitted, stop.Ori, stop.Id);
                log.LogInformation($"Using filename: {fileName}");
                if (fileName == null)
                {
                    await serviceBusReceiver.AbandonMessageAsync(m); // allows for retry to occur. 

                    continue;
                }

                //Get Doj Stop
                DojStop dojStop = GetDojStop(log, stop);

                if (dojStop == null)
                {
                    //if the cast error fails report, retry the message
                    if (!await HandledDojCastError(log, stop, dateSubmitted, fileName, submissionMessage.SubmissionId))
                    {
                        await serviceBusReceiver.AbandonMessageAsync(m); // allows for retry to occur. 

                        continue;
                    }
                    else
                    {
                        await serviceBusReceiver.CompleteMessageAsync(m); // message complete

                        continue;
                    }
                }

                //Get File Bytes
                byte[] bytes = GetFileBytes(log, dojStop);

                if (bytes == null)
                {
                    log.LogWarning($"Failed to get file contents: {dojStop.LEARecordID}");
                    await serviceBusReceiver.AbandonMessageAsync(m); // allows for retry to occur. 

                    continue;
                }

                //Upload Blob
                if (!await UploadBlob(log, bytes, fileName, stop.Id))
                {
                    log.LogWarning($"Failed to upload blob: {stop.Id}");
                    await serviceBusReceiver.AbandonMessageAsync(m); // allows for retry to occur. 

                    continue;
                }

                if (!UploadSftpFile(log, bytes, fileName, stop.Id))
                {
                    log.LogWarning($"Failed to upload to FTP: {stop.Id}");
                    await RemoveBlob(log, fileName, stop.Id); //delete the blob to clean up the failed run
                    await serviceBusReceiver.AbandonMessageAsync(m); // allows for retry to occur. 

                    continue;

                }

                if (!await HandleDojSubmitSuccess(log, stop, dateSubmitted, submissionMessage.SubmissionId, fileName))
                {
                    log.LogWarning($"Failed to handle doj submit success: {stop.Id}");
                    RemoveSftpFile(log, fileName, stop.Id); //remove the file from the SFTP server so it doesnt get duplicated. 
                    await serviceBusReceiver.AbandonMessageAsync(m); // allows for retry to occur. 

                    continue;
                }
             
                await serviceBusReceiver.CompleteMessageAsync(m); // message complete

                log.LogInformation($"Finished processing STOP : {stop.Id}");
            }

            log.LogInformation($"TimersSubmissionConsumer finished at: {DateTime.Now} : {run.ToString()}");
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

        private async Task<Stop> GetStop(ILogger log, string id)
        {
            try
            {
                log.LogInformation($"GetStop: {id}");
                return await _stopCosmosDbService.GetStopAsync(id);
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during GetStop with id {id}");
                return null;
            }
        }

        private static string GetFileName(ILogger log, Guid submissionId, DateTime date, string ori, string stopId)
        {
            try
            {
                return $"{date.ToString("yyyyMMdd")}/{submissionId}/{date:yyyyMMddHHmmss}_{ori}_{stopId}.json";
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during GetFileName with id {stopId}");
                return null;
            }
        }

        private DojStop GetDojStop(ILogger log, Stop stop)
        {
            try
            {
                log.LogInformation($"Casting Stop to DoJStop: {stop.Id}");
                return _stopService.CastToDojStop(stop);
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during GetDojStop with id {stop.Id}");
                return null;
            }
        }

        private async Task<bool> HandledDojCastError(ILogger log, Stop stop, DateTime date, string fileName, Guid submissionId)
        {
            try
            {
                log.LogWarning($"Handling DoJ Cast Error: {stop.Id}");
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

        private static byte[] GetFileBytes(ILogger log, DojStop dojStop)
        {
            try
            {
                log.LogInformation($"Getting file contents: {dojStop.LEARecordID}");
                var settings = new JsonSerializerSettings() { ContractResolver = new NullToEmptyStringResolver() };
                return Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(dojStop, settings));
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during GetFileBytes with stop id {dojStop.LEARecordID}");
                return null;
            }
        }

        private async Task<bool> UploadBlob(ILogger log, byte[] bytes, string fileName, string stopId)
        {
            try
            {
                log.LogInformation($"Uploading to blob: {stopId}");
                await blobUtilities.UploadBlobJson(bytes, fileName, _blobContainerClient); //Upload json as Blob to Azure Storage Container 
                return true;
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during UploadBlob with stop id {stopId}");
                return false;
            }
        }

        private async Task<bool> RemoveBlob(ILogger log, string fileName, string stopId)
        {
            try
            {
                await blobUtilities.DeleteBlobJson(fileName, _blobContainerClient);
                return true;
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during DeleteBlob with stop id {stopId}");
                return false;
            }
        }

        private bool UploadSftpFile(ILogger log, byte[] bytes, string fileName, string stopId)
        {
            try
            {
                log.LogInformation($"Uploading to FTP: {stopId}");
                _sftpService.UploadStop(bytes, $"{_sftpInputPath}{fileName.Split("/")[2]}");
                return true;
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during UploadSftpFile with stop id {stopId}");
                return false;
            }
        }

        private bool RemoveSftpFile(ILogger log, string fileName, string stopId)
        {
            try
            {
                _sftpService.DeleteFile($"{_sftpInputPath}{fileName.Split("/")[2]}");
                return true;
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during DeleteSftpFile with stop id {stopId}");
                return false;
            }
        }

        private async Task<bool> HandleDojSubmitSuccess(ILogger log, Stop stop, DateTime date, Guid submissionId, string fileName)
        {
            try
            {
                log.LogInformation($"Handling DoJ submission success: {stop.Id}");
                await _stopCosmosDbService.UpdateStopAsync(_stopService.NewSubmission(stop, date, submissionId, fileName));
                return true;
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during update stop status stop id {stop.Id}");
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
            catch (Exception e)
            {
                throw new Exception("Failed to update stop submission error");
            }
        }

    }
}
