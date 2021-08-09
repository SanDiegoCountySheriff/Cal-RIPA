using System;
using System.Text;
using Azure.Storage.Blobs;
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
            [ServiceBusTrigger("submission", Connection = "ServiceBusConnection")] string myQueueItem,
            ILogger log)
        {
            log.LogInformation($"C# ServiceBus queue trigger function processed message: {myQueueItem}");

            DateTime dateSubmitted = DateTime.UtcNow;
            string fileName = string.Empty;
            DojStop dojStop = new DojStop();
            try
            {
                SubmissionMessage submissionMessage = JsonConvert.DeserializeObject<SubmissionMessage>(myQueueItem);

                Stop stop = await _stopCosmosDbService.GetStopAsync(submissionMessage.StopId);

                try
                {

                    fileName = $"{DateTime.UtcNow.ToString("yyyyMMdd")}/{submissionMessage.SubmissionId}/{dateSubmitted:yyyyMMddHHmmss}_{stop.Ori}_{stop.Id}.json";
                    dojStop = _stopService.CastToDojStop(stop);
                }
                catch (Exception ex)
                {
                    try
                    {
                        SubmissionError submissionError = new SubmissionError()
                        {
                            Code = "FTS",
                            Message = "Failed to submit to DOJ. Stop to DOJ Cast failure",
                            DateReported = dateSubmitted,
                            ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.SubmissionError),
                            FileName = fileName,
                            SubmissionId = submissionMessage.SubmissionId
                        };
                        await _stopCosmosDbService.UpdateStopAsync(_stopService.ErrorSubmission(stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
                        log.LogError($"Failure Casting Stop with id {stop.Id}: {ex.Message}");
                        return;
                    }
                    catch (Exception e)
                    {
                        throw new Exception("Failed to update stop submission error");
                    }
                }

                try
                {
                    var settings = new JsonSerializerSettings() { ContractResolver = new NullToEmptyStringResolver() };
                    byte[] bytes = Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(dojStop, settings));

                    //1 
                    await blobUtilities.UploadBlobJson(bytes, fileName, _blobContainerClient); //Upload json as Blob to Azure Storage Container 
                    //2 
                    //_sftpService.UploadStop(bytes, $"{_sftpInputPath}{fileName.Split("/")[2]}"); //Upload json to SFTP
                    _sftpService.UploadStop(bytes, $"{_sftpInputPath}{fileName.Split("/")[2]}"); //Upload json to SFTP
                    //3
                    await _stopCosmosDbService.UpdateStopAsync(_stopService.NewSubmission(stop, dateSubmitted, submissionMessage.SubmissionId, fileName));
                    log.LogInformation($"submitted stop with id: {stop.Id} for submission with id: {submissionMessage.SubmissionId}");
                }
                catch (Exception ex)
                {
                    try
                    {
                        SubmissionError submissionError = new SubmissionError()
                        {
                            Code = "FTS",
                            Message = "Failed to submit to DOJ. SFTP connection, Blob Connection failure",
                            DateReported = dateSubmitted,
                            ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.SubmissionError),
                            FileName = fileName,
                            SubmissionId = submissionMessage.SubmissionId
                        };
                        await _stopCosmosDbService.UpdateStopAsync(_stopService.ErrorSubmission(stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Unsubmitted)));
                        log.LogError($"Failure Submitting Stop with id {stop.Id}: {ex.Message}");
                        return;
                    }
                    catch (Exception e)
                    {
                        throw new Exception("Failed to update stop submission error");
                    }
                }
            }
            catch (Exception ex)
            {
                log.LogError($"Failed to process submission message: {myQueueItem}, {ex}");
            }
        }


        public BlobContainerClient GetBlobContainerClient()
        {
            BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
            string containerName = $"{_storageContainerNamePrefix}";
            BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
            return blobContainerClient;
        }


    }
}
