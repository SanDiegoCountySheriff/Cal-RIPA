using Microsoft.Extensions.Logging;
using Renci.SshNet;
using Renci.SshNet.Sftp;
using RIPA.Functions.Submission.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;

namespace RIPA.Functions.Submission.Services.SFTP
{
    class SftpService
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

        public void UploadStop(Stop stop, string remoteFilePath)
        {
            using var client = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, _config.Password);
            try
            {
                client.Connect();
                byte[] bytes = Encoding.ASCII.GetBytes(JsonSerializer.Serialize(stop));
                MemoryStream stream = new MemoryStream(bytes);
                client.UploadFile(stream, remoteFilePath);
                _logger.LogInformation($"Finished uploading stop [{stop.id}] to [{remoteFilePath}]");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, $"Failed in uploading stop [{stop.id}] to [{remoteFilePath}]");
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