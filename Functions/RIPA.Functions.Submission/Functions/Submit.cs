using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Renci.SshNet;
using Renci.SshNet.Sftp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Submission.Functions
{
    public static class Submission
    {
        [FunctionName("Submit")]
        [OpenApiOperation(operationId: "Submit", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "DOJ Submit Success")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var config = new SftpConfig
            {
                Host = Environment.GetEnvironmentVariable("SftpHost"),
                Port = Convert.ToInt32(Environment.GetEnvironmentVariable("SftpPort")),
                UserName = Environment.GetEnvironmentVariable("SftpUserName"),
                Password = Environment.GetEnvironmentVariable("SftpPassword")
            };
            SftpService sftpService = new SftpService(log, config);

            sftpService.ListAllFiles(Environment.GetEnvironmentVariable("SftpOutput"));
                

            sftpService.UploadFile(@"C:\Users\LPOPE\source\Temp\test1.txt", Environment.GetEnvironmentVariable("SftpInput"));

            string responseMessage = "DOJ record submit completed successfully";

            return new OkObjectResult(responseMessage);
        }
    }

    public class SftpConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class SftpService
    {
        private readonly ILogger _logger;
        private readonly SftpConfig _config;

        public SftpService(ILogger logger, SftpConfig sftpConfig)
        {
            _logger = logger;
            _config = sftpConfig;
        }

        public IEnumerable<SftpFile> ListAllFiles(string remoteDirectory = ".")
        {
            using var client = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, _config.Password);
            try
            {
                client.Connect();
                return client.ListDirectory(remoteDirectory);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in listing files under [{remoteDirectory}]");
                return null;
            }
            finally
            {
                client.Disconnect();
            }
        }

        public void UploadFile(string localFilePath, string remoteFilePath)
        {
            using var client = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, _config.Password);
            try
            {
                client.Connect();
                using var s = File.OpenRead(localFilePath);
                client.UploadFile(s, remoteFilePath);
                _logger.LogInformation($"Finished uploading file [{localFilePath}] to [{remoteFilePath}]");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in uploading file [{localFilePath}] to [{remoteFilePath}]");
            }
            finally
            {
                client.Disconnect();
            }
        }

        public void DownloadFile(string remoteFilePath, string localFilePath)
        {
            using var client = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, _config.Password);
            try
            {
                client.Connect();
                using var s = File.Create(localFilePath);
                client.DownloadFile(remoteFilePath, s);
                _logger.LogInformation($"Finished downloading file [{localFilePath}] from [{remoteFilePath}]");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in downloading file [{localFilePath}] from [{remoteFilePath}]");
            }
            finally
            {
                client.Disconnect();
            }
        }

        public void DeleteFile(string remoteFilePath)
        {
            using var client = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, _config.Password);
            try
            {
                client.Connect();
                client.DeleteFile(remoteFilePath);
                _logger.LogInformation($"File [{remoteFilePath}] deleted.");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in deleting file [{remoteFilePath}]");
            }
            finally
            {
                client.Disconnect();
            }
        }
    }

}

