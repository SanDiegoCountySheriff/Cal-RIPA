using Azure.Messaging.ServiceBus;
using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static RIPA.Functions.Submission.Services.ServiceBus.ResultServiceBusService;

namespace RIPA.Functions.Submission.Functions
{
    public class TimerGetSubmitResults
    {
        private readonly ISftpService _sftpService;
        private readonly IResultServiceBusService _resultServiceBusService;
        private readonly string _sftpOutputPath;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;

        public TimerGetSubmitResults(ISftpService sftpService, IResultServiceBusService resultServiceBusService)
        {
            _sftpService = sftpService;
            _sftpOutputPath = Environment.GetEnvironmentVariable("SftpOutputPath");
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixResults");
            _resultServiceBusService = resultServiceBusService;
        }

        [FunctionName("TimerGetSubmitResults")]
        public async Task Run([TimerTrigger("0 */15 * * * *", RunOnStartup = true)] TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"Timer trigger runs each day at 9:30AM: {DateTime.Now} and mytimer isPastDue: {myTimer.IsPastDue}");

            IEnumerable<Renci.SshNet.Sftp.SftpFile> files = null;
            try
            {
                files = _sftpService.ListAllFiles(_sftpOutputPath);
            }
            catch (Exception e)
            {
                log.LogError($"Unable to connect to SFTP {e.Message}");
                return;
            }
            if (files == null || files.Where(x => x.IsDirectory == false).Count() == 0) return; //Nothing to process --> exit

            Guid correlationId = Guid.NewGuid();
            BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
            string containerName = _storageContainerNamePrefix;
            BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
            await blobContainerClient.CreateIfNotExistsAsync();

            foreach (var file in files.Where(x => x.IsDirectory == false))
            {
                try
                {
                    log.LogInformation($"processing file {file.Name}");
                    var fileText = await _sftpService.DownloadFileToBlobAsync(file.FullName, $"{DateTime.UtcNow.ToString("yyyyMMdd")}/{correlationId}/{file.Name}", blobContainerClient);
                    log.LogInformation($"file text: {fileText}");
                    await ProcessDojResponse(fileText);
                    log.LogInformation("processed DOJ Response");
                    _sftpService.DeleteFile(file.FullName);
                    log.LogInformation($"deleted sftp file {file.Name}");
                }
                catch (Exception e)
                {
                    log.LogError($"an error occurred processing doj sftp result {e.Message}");
                }
            }
        }

        public async Task ProcessDojResponse(string dojResponse)
        {
            var split1 = dojResponse.Split("Agency ORI|File name|Date Submitted|Time Submitted|Error message");
            var split2 = split1[1].Split("Agency ORI|File name|LEA record ID|Error List");
            var fileLevelFatalErrors = split2[0].Replace("Record Level Fatal Errors:", string.Empty).Trim();
            var recordLevelFatalErrors = split2[1].Replace("Record Level Errors:", string.Empty).Trim();
            var recordLevelErrors = split2[2].Trim();
            await ProcessDojErrors(fileLevelFatalErrors, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.FileLevelFatalError));
            await ProcessDojErrors(recordLevelFatalErrors, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError));
            await ProcessDojErrors(recordLevelErrors, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelError));
        }

        public async Task ProcessDojErrors(string errorLines, string errorType)
        {
            List<ServiceBusMessage> listServiceBusMessage = new List<ServiceBusMessage>();
            using StringReader reader = new StringReader(errorLines);
            string line;
            while ((line = reader.ReadLine()) != null)
            {
                listServiceBusMessage.Add(new ServiceBusMessage(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new ResultMessage() { Error = line, ErrorType = errorType }))));
            }
            await _resultServiceBusService.SendServiceBusMessagesAsync(listServiceBusMessage);
        }
    }
}
