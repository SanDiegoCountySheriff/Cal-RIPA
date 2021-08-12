using System;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.Azure.ServiceBus.Core;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Submission.Models;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using RIPA.Functions.Submission.Utility;
using static RIPA.Functions.Submission.Services.ServiceBus.SubmissionServiceBusService;

namespace RIPA.Functions.Submission.Functions
{
    public class ServiceBusSubmissionConsumer
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly ISftpService _sftpService;
        private readonly IStopService _stopService;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;
        private readonly string _sftpInputPath;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly BlobUtilities blobUtilities = new BlobUtilities();

        public ServiceBusSubmissionConsumer(IStopCosmosDbService stopCosmosDbService, ISftpService sftpService, IStopService stopService)
        {
            _stopCosmosDbService = stopCosmosDbService;
            _sftpService = sftpService;
            _stopService = stopService;
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixSubmissions");
            _sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");
            _blobContainerClient = GetBlobContainerClient();
        }

        [FunctionName("ServiceBusSubmissionConsumer")]
        public async void Run(
            [ServiceBusTrigger("submission", Connection = "ServiceBusConnection")] string myQueueItem, int deliveryCount,
            MessageReceiver messageReceiver, string lockToken,
            ILogger log)
        {
            log.LogInformation($"C# ServiceBus queue trigger function processed message: {myQueueItem}");

            SubmissionMessage submissionMessage = DeserializeQueueItem(log, myQueueItem);

            if (submissionMessage == null)
            {
                await messageReceiver.DeadLetterAsync(lockToken);

                return;
            }

            //Get Stop
            Stop stop = await GetStop(log, submissionMessage.StopId);

            if (stop == null)
            {
                await messageReceiver.AbandonAsync(lockToken); // allows for retry to occur. 

                return;
            }

            DateTime dateSubmitted = DateTime.UtcNow;

            //Get File Name
            string fileName = GetFileName(log, submissionMessage.SubmissionId, dateSubmitted, stop.Ori, stop.Id);

            if (fileName == null)
            {
                await messageReceiver.AbandonAsync(lockToken); // allows for retry to occur. 

                return;
            }

            //Get Doj Stop
            DojStop dojStop = GetDojStop(log, stop);

            if (dojStop == null)
            {
                //if the cast error fails report, retry the message
                if (!await HandledDojCastError(log, stop, dateSubmitted, fileName, submissionMessage.SubmissionId))
                {
                    await messageReceiver.AbandonAsync(lockToken); // allows for retry to occur. 

                    return;
                }
                else
                {
                    await messageReceiver.CompleteAsync(lockToken); // message complete

                    return;
                }
            }

            //Get File Bytes
            byte[] bytes = GetFileBytes(log, dojStop);

            if (bytes == null)
            {
                await messageReceiver.AbandonAsync(lockToken); // allows for retry to occur. 

                return;
            }

            //Upload Blob
            if (!await UploadBlob(log, bytes, fileName, stop.Id))
            {
                await messageReceiver.AbandonAsync(lockToken); // allows for retry to occur. 

                return;
            }

            if (!UploadSftpFile(log, bytes, fileName, stop.Id))
            {
                //TODO Delete the file from Blob to clean up because it will reupload to blob on its retry. 
                await messageReceiver.AbandonAsync(lockToken); // allows for retry to occur. 

                return;

            }

            if (!await HandleDojSubmitSuccess(log, stop, dateSubmitted, submissionMessage.SubmissionId, fileName))
            {
                //TODO remove the file from SFTP because it will be reuploaded on its retry
                await messageReceiver.AbandonAsync(lockToken); // allows for retry to occur. 

                return;
            }

            await messageReceiver.CompleteAsync(lockToken);
                      
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
                await blobUtilities.UploadBlobJson(bytes, fileName, _blobContainerClient, log); //Upload json as Blob to Azure Storage Container 
                return true;
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during UploadBlob with stop id {stopId}");
                return false;
            }
        }

        private bool UploadSftpFile(ILogger log, byte[] bytes, string fileName, string stopId)
        {
            try
            {
                _sftpService.UploadStop(bytes, $"{_sftpInputPath}{fileName.Split("/")[2]}");
                return true;
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during UploadSftpFile with stop id {stopId}");
                return false;
            }
        }

        private async Task<bool> HandleDojSubmitSuccess(ILogger log, Stop stop, DateTime date, Guid submissionId, string fileName)
        {
            try
            {
                await _stopCosmosDbService.UpdateStopAsync(_stopService.NewSubmission(stop, date, submissionId, fileName));
                return true;
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex} --> occurred during UploadSftpFile with stop id {stop.Id}");
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
