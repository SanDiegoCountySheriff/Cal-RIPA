using System;
using System.Linq;
using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Submission.Services.SFTP;

namespace RIPA.Functions.Submission.Functions
{
    public static class TimerGetSubmitResults
    {
        private static string sftpOutputPath = Environment.GetEnvironmentVariable("SftpOutputPath");
        private static string storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
        private static string storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefix");

        [FunctionName("TimerGetSubmitResults")]
        public static async void Run([TimerTrigger("0 30 9 * * *", RunOnStartup = true)]TimerInfo myTimer, ILogger log)
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
            foreach(var file in files.Where(x=>x.IsDirectory == false))
            {
                //Download process and delete
                var fileText = await sftpService.DownloadFileToBlobAsync(file.FullName, file.Name, blobContainerClient);
                Console.WriteLine($"{fileText}"); //Process this string
                //TODO foreach result, update the records DojSubmit ojbect 
                sftpService.DeleteFile(file.FullName);

            }
            //Update the submission Object
        }
    }
}
