using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Submission.Services.REST;
using RIPA.Functions.Submission.Services.SFTP;

namespace RIPA.Functions.Submission.Functions
{
    public static class TimerGetSubmitResults
    {
        private static readonly string sftpOutputPath = Environment.GetEnvironmentVariable("SftpOutputPath");
        private static readonly string storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
        private static readonly string storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefix");
        private static readonly HttpClient httpClient = new HttpClient();
        private static readonly StopService stopService = new StopService(httpClient);

        [FunctionName("TimerGetSubmitResults")]
        public static async void Run([TimerTrigger("0 30 9 * * *", RunOnStartup = true)] TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"Timer trigger runs each day at 9:30AM: {DateTime.Now}");

            var config = new SftpConfig
            {
                Host = Environment.GetEnvironmentVariable("SftpHost"),
                Port = Convert.ToInt32(Environment.GetEnvironmentVariable("SftpPort")),
                UserName = Environment.GetEnvironmentVariable("SftpUserName"),
                Password = Environment.GetEnvironmentVariable("SftpPassword")
            };
            SftpService sftpService = new SftpService(log, config);

            Guid correlationId = Guid.NewGuid();
            BlobServiceClient blobServiceClient = new BlobServiceClient(storageConnectionString);
            string containerName = storageContainerNamePrefix + correlationId.ToString();
            BlobContainerClient blobContainerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);

            var files = sftpService.ListAllFiles(sftpOutputPath);
            foreach (var file in files.Where(x => x.IsDirectory == false))
            {
                try
                {
                    //Download process and delete
                    var fileText = await sftpService.DownloadFileToBlobAsync(file.FullName, file.Name, blobContainerClient);
                    ProcessDojResponse(fileText);
                    Console.WriteLine($"{fileText}"); //Process this string
                                                      //TODO foreach result, update the records DojSubmit ojbect 
                    sftpService.DeleteFile(file.FullName);
                }
                catch (Exception e)
                {
                    //move file to Deadletter directory on DOJ sftp if they allow us to create a directory
                    //if we cant do this on SFTP, Consider creating AZURE blob container to house these files. 
                    //and remove the blob from the results cotnainer 
                }

            }
            //Update the submission Object
        }

        public static void ProcessDojResponse(string dojResponse)
        {
            var split1 = dojResponse.Split("Agency ORI|File name|Date Submitted|Time Submitted|Error message");
            var split2 = split1[1].Split("Agency ORI|File name|LEA record ID|Error List");
            var fileLevelFatalErrors = split2[0].Replace("Record Level Errors:", string.Empty).Trim();
            var recordLevelErrors = split2[1].Trim();
            ProcessFileLevelFatalErrors(fileLevelFatalErrors);
            ProcessRecordLevelErrors(recordLevelErrors);
        }

        public static async void ProcessFileLevelFatalErrors(string fileLevelFatalErrors)
        {
            using (StringReader reader = new StringReader(fileLevelFatalErrors))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    var fileLevelFatalError = DeserializeFileLevelFatalError(line);
                    var stopId = fileLevelFatalError.FileName.Split("_")[2].Replace(".json", string.Empty);
                    var stop = await stopService.GetStop(stopId);
                    stopService.PutStop(stopService.ErrorSubmission(stop, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.FileLevelFatalError), fileLevelFatalError.ErrorMessage, fileLevelFatalError.FileName));
                }
            }
        }

        public static async void ProcessRecordLevelErrors(string recordLevelErrors)
        {
            using (StringReader reader = new StringReader(recordLevelErrors))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    var recordLevelError = DeserializeRecordLevelError(line);
                    var stop = await stopService.GetStop(recordLevelError.LeaRecordId);
                    stopService.PutStop(stopService.ErrorSubmission(stop, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelError), recordLevelError.ErrorList, recordLevelError.FileName));
                }
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
                ErrorMessage = values[4]
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
                ErrorList = values[3]
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
