using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;


namespace RIPA.Functions.Submission.Functions
{
    public class TimerGetSubmitResults
    {
        private readonly ISftpService _sftpService;
        private readonly IStopService _stopService;
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly string _sftpOutputPath;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;

        public TimerGetSubmitResults(ISftpService sftpService, IStopService stopService, IStopCosmosDbService stopCosmosDbService)
        {
            _sftpService = sftpService;
            _stopService = stopService;
            _stopCosmosDbService = stopCosmosDbService;
            _sftpOutputPath = Environment.GetEnvironmentVariable("SftpOutputPath");
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixResults");
        }

        [FunctionName("TimerGetSubmitResults")]
        public async void Run([TimerTrigger("0 30 9 * * *", RunOnStartup = true)] TimerInfo myTimer, ILogger log)
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
                    var fileText = await _sftpService.DownloadFileToBlobAsync(file.FullName, $"{DateTime.UtcNow.ToString("yyyyMMdd")}/{correlationId}/{file.Name}", blobContainerClient);
                    ProcessDojResponse(fileText);
                    _sftpService.DeleteFile(file.FullName);

                }
                catch (Exception e)
                {
                    log.LogError($"an error occurred processing doj sftp result {e.Message}");
                }
            }
        }

        public void ProcessDojResponse(string dojResponse)
        {
            var split1 = dojResponse.Split("Agency ORI|File name|Date Submitted|Time Submitted|Error message");
            var split2 = split1[1].Split("Agency ORI|File name|LEA record ID|Error List");
            var fileLevelFatalErrors = split2[0].Replace("Record Level Fatal Errors:", string.Empty).Trim();
            var recordLevelFatalErrors = split2[1].Replace("Record Level Errors:", string.Empty).Trim();
            var recordLevelErrors = split2[2].Trim();
            ProcessFileLevelFatalErrors(fileLevelFatalErrors);
            ProcessRecordLevelErrors(recordLevelFatalErrors, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError));
            ProcessRecordLevelErrors(recordLevelErrors, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelError));
        }

        public async void ProcessFileLevelFatalErrors(string fileLevelFatalErrors)
        {
            using StringReader reader = new StringReader(fileLevelFatalErrors);
            string line;
            while ((line = reader.ReadLine()) != null)
            {
                var fileLevelFatalError = DeserializeFileLevelFatalError(line);
                var stopId = fileLevelFatalError.FileName.Split("_")[2].Replace(".json", string.Empty);
                var stop = await _stopCosmosDbService.GetStopAsync(stopId);
                SubmissionError submissionError = new SubmissionError
                {
                    DateReported = DateTime.UtcNow,
                    Code = "FLFE",
                    ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.FileLevelFatalError),
                    Message = fileLevelFatalError.ErrorMessage,
                    FileName = fileLevelFatalError.FileName
                };

                await _stopCosmosDbService.UpdateStopAsync(stopId, _stopService.ErrorSubmission(stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
            }
        }

        public async void ProcessRecordLevelErrors(string recordLevelErrors, string type)
        {
            using StringReader reader = new StringReader(recordLevelErrors);
            string line;
            while ((line = reader.ReadLine()) != null)
            {
                var recordLevelError = DeserializeRecordLevelError(line);
                var stop = await _stopCosmosDbService.GetStopAsync(recordLevelError.LeaRecordId);
                SubmissionError submissionError = new SubmissionError
                {
                    DateReported = DateTime.UtcNow,
                    Code = type == Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError) ? "RLFE" : recordLevelError.ErrorList.Split("::")[0],
                    ErrorType = type,
                    Message = type == Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError) ? recordLevelError.ErrorList : recordLevelError.ErrorList.Split("::")[1],
                    FileName = recordLevelError.FileName
                };
                await _stopCosmosDbService.UpdateStopAsync(recordLevelError.LeaRecordId, _stopService.ErrorSubmission(stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
            }
        }

        public static FileLevelFatalError DeserializeFileLevelFatalError(string fileLevelFatalErrorString)
        {
            string[] values = fileLevelFatalErrorString.Split("|");
            FileLevelFatalError fileLevelFatalError = new FileLevelFatalError
            {
                AgencyOri = values[0],
                FileName = values[1],
                DateSubmitted = values[2],
                TimeSubmitted = values[3],
                ErrorMessage = values[4].Replace("\"", string.Empty)
            };
            return fileLevelFatalError;
        }

        public class FileLevelFatalError
        {
            public string AgencyOri { get; set; }
            public string FileName { get; set; }
            public string DateSubmitted { get; set; }
            public string TimeSubmitted { get; set; }
            public string ErrorMessage { get; set; }
        }

        public static RecordLevelError DeserializeRecordLevelError(string recordLevelErrorString)
        {
            string[] values = recordLevelErrorString.Split("|");
            RecordLevelError recordLevelError = new RecordLevelError
            {
                AgencyOri = values[0],
                FileName = values[1],
                LeaRecordId = values[2],
                ErrorList = values[3].Replace("\"", string.Empty)
            };
            return recordLevelError;
        }

        public class RecordLevelError
        {
            public string AgencyOri { get; set; }
            public string FileName { get; set; }
            public string LeaRecordId { get; set; }
            public string ErrorList { get; set; }

        }

    }
}
