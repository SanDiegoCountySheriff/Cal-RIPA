using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Renci.SshNet;
using Renci.SshNet.Sftp;
using RIPA.Functions.Submission.Models;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using RIPA.Functions.Submission.Utility;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.SFTP
{
    public class SftpService : ISftpService
    {
        public readonly ILogger _logger;
        public readonly SftpConfig _config;
        public readonly bool _disabled;

        public readonly SftpClient _sftpClient;

        public SftpService(ILogger logger, SftpConfig sftpConfig)
        {
            _logger = logger;
            _config = sftpConfig;
            byte[] byteArray = Encoding.UTF8.GetBytes(_config.Key);
            using MemoryStream stream = new MemoryStream(byteArray);
            var sftpDisabled = Environment.GetEnvironmentVariable("SftpDisabled");

            if (!String.IsNullOrEmpty(sftpDisabled))
            {
                if (bool.Parse(sftpDisabled))
                {
                    _disabled = true;
                }
            }

            if (!_disabled)
            {
                _sftpClient = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, new Renci.SshNet.PrivateKeyFile(stream, _config.Password));
            }

            //_sftpClient.KeepAliveInterval = TimeSpan.FromSeconds(60);
            //_sftpClient.ConnectionInfo.Timeout = TimeSpan.FromMinutes(180);
            //_sftpClient.OperationTimeout = TimeSpan.FromMinutes(180);

        }

        public void Connect()
        {
            if (_disabled)
                throw new Exception("sftp client disabled");
            if (!_sftpClient.IsConnected)
                _sftpClient.Connect();
        }

        public void Dispose()
        {
            if (_sftpClient.IsConnected)
                _sftpClient.Disconnect();
            _sftpClient.Dispose();
        }

        public IEnumerable<SftpFile> ListAllFiles(string remoteDirectory = ".")
        {
            try
            {
                Connect();
                return _sftpClient.ListDirectory(remoteDirectory);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in listing files under [{remoteDirectory}]");
                return null;
            }
        }

        public void UploadFile(string localFilePath, string remoteFilePath)
        {
            try
            {
                Connect();
                using var s = File.OpenRead(localFilePath);
                _sftpClient.UploadFile(s, remoteFilePath);
                _logger.LogInformation($"Finished uploading file [{localFilePath}] to [{remoteFilePath}]");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in uploading file [{localFilePath}] to [{remoteFilePath}]");
            }
        }

        public void UploadStop(byte[] bytes, string remoteFilePath)
        {
            try
            {
                Connect();
                using (MemoryStream stream = new MemoryStream(bytes))
                {
                    _sftpClient.UploadFile(stream, remoteFilePath); // stream file to DOJ SFTP 
                }
                _logger.LogInformation($"Finished uploading stop to [{remoteFilePath}]");
            }
            catch (Exception exception)
            {
                _logger.LogError($"Failed in uploading stop to [{remoteFilePath}] with exception {exception.Message}");
                throw new Exception($"Failed in uploading stop to [{remoteFilePath}]");
            }
        }

        public void UploadJsonString(string jsonString, string remoteFilePath)
        {
            try
            {
                Connect();
                byte[] bytes = Encoding.ASCII.GetBytes(jsonString);
                MemoryStream stream = new MemoryStream(bytes);
                _sftpClient.UploadFile(stream, remoteFilePath);
                _logger.LogInformation($"Finished uploading stop [{jsonString}] to [{remoteFilePath}]");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in uploading stop [{jsonString}] to [{remoteFilePath}]");
            }
        }

        public async Task<string> DownloadFileToBlobAsync(string remoteFilePath, string localFilePath, BlobContainerClient blobContainerClient)
        {

            try
            {
                BlobClient blobClient = blobContainerClient.GetBlobClient(localFilePath);
                Connect();
                var blobInfo = await blobClient.UploadAsync(_sftpClient.OpenRead(remoteFilePath)); //stream file to Azure Blob
                var download = await blobClient.DownloadAsync(); //Download blob
                string text;
                using (StreamReader streamReader = new StreamReader(download.Value.Content))
                {
                    text = streamReader.ReadToEnd(); //get file content
                }
                _logger.LogInformation($"Finished transferring file [{localFilePath}] from [{remoteFilePath}]");
                return text;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in transferring file [{localFilePath}] from [{remoteFilePath}]");
            }


            return null;
        }

        public void DeleteFile(string remoteFilePath)
        {
            try
            {
                Connect();
                _sftpClient.DeleteFile(remoteFilePath);
                _logger.LogInformation($"File [{remoteFilePath}] deleted.");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in deleting file [{remoteFilePath}]");
            }
        }
    }
}