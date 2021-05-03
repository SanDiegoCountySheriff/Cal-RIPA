using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using Renci.SshNet;
using Renci.SshNet.Sftp;
using RIPA.Functions.Submission.Models;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
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

        public void UploadStop(DojStop stop, string remoteFilePath)
        {
            using var client = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, _config.Password);
            try
            {
                client.Connect();
                byte[] bytes = Encoding.ASCII.GetBytes(JsonSerializer.Serialize(stop));
                MemoryStream stream = new MemoryStream(bytes);
                client.UploadFile(stream, remoteFilePath);
                _logger.LogInformation($"Finished uploading stop [{stop.LEARecordID}] to [{remoteFilePath}]");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in uploading stop [{stop.LEARecordID}] to [{remoteFilePath}]");
            }
            finally
            {
                client.Disconnect();
            }
        }

        public void UploadJsonString(string jsonString, string remoteFilePath)
        {
            using var client = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, _config.Password);
            try
            {
                client.Connect();
                byte[] bytes = Encoding.ASCII.GetBytes(jsonString);
                MemoryStream stream = new MemoryStream(bytes);
                client.UploadFile(stream, remoteFilePath);
                _logger.LogInformation($"Finished uploading stop [{jsonString}] to [{remoteFilePath}]");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in uploading stop [{jsonString}] to [{remoteFilePath}]");
            }
            finally
            {
                client.Disconnect();
            }
        }

        public async Task<string> DownloadFileToBlobAsync(string remoteFilePath, string localFilePath, BlobContainerClient blobContainerClient)
        {
            using var client = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, _config.Password);
            try
            {
                BlobClient blobClient = blobContainerClient.GetBlobClient(localFilePath);
                client.Connect();
                var blobInfo = await blobClient.UploadAsync(client.OpenRead(remoteFilePath)); //stream file to Azure Blob
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
            finally
            {
                client.Disconnect();
            }

            return null;
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