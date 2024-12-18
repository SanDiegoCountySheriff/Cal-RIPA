using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using Renci.SshNet;
using Renci.SshNet.Sftp;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.SFTP;

public class SftpService : ISftpService
{
    public readonly ILogger<SftpService> _logger;
    public readonly SftpConfig _config;
    public readonly bool _disabled;
    public readonly SftpClient _sftpClient;

    public SftpService(ILogger<SftpService> logger)
    {
        _config = new SftpConfig
        {
            Host = Environment.GetEnvironmentVariable("SftpHost"),
            Port = Convert.ToInt32(Environment.GetEnvironmentVariable("SftpPort")),
            UserName = Environment.GetEnvironmentVariable("SftpUserName"),
            Password = Environment.GetEnvironmentVariable("SftpPassword"),
            Key = Environment.GetEnvironmentVariable("SftpKey")
        };
#if DEBUG
        _config.Key = File.ReadAllText(@"/PATH/TO/lplp.ppk");
#endif
        _logger = logger;
        var sftpDisabled = Environment.GetEnvironmentVariable("SftpDisabled");

        if (!String.IsNullOrEmpty(sftpDisabled))
        {
            if (bool.Parse(sftpDisabled))
            {
                _logger.LogWarning("Sftp is disabled by configuration");
                _disabled = true;
                return;
            }
        }

        _logger.LogInformation("Starting SftpClient");

        try
        {
            byte[] byteArray = Encoding.UTF8.GetBytes(_config.Key);
            using MemoryStream stream = new MemoryStream(byteArray);

            _sftpClient = new SftpClient(_config.Host, _config.Port == 0 ? 22 : _config.Port, _config.UserName, new PrivateKeyFile(stream, _config.Password));
        }
        catch (Exception ex)
        {
            _logger.LogError("SftpClient failed: ", ex.Message);
        }

    }

    public async Task Connect()
    {
        if (_disabled)
        {
            throw new Exception("sftp client disabled");
        }

        if (_sftpClient != null && !_sftpClient.IsConnected)
        {
            int attempts = 1;
            do
            {
                try
                {
                    _sftpClient.Connect();
                }
                catch (Renci.SshNet.Common.SshConnectionException e)
                {
                    attempts++;
                }

                await Task.Delay(attempts * 1000).ConfigureAwait(false);
            } while (attempts < 10 && !_sftpClient.IsConnected);
        }
    }

    public void Dispose()
    {
        if (_sftpClient != null)
        {
            if (_sftpClient.IsConnected)
            {
                _sftpClient.Disconnect();
            }

            _sftpClient.Dispose();
        }
    }

    public async Task<IEnumerable<SftpFile>> ListAllFiles(string remoteDirectory = ".")
    {
        try
        {
            await Connect();

            return _sftpClient.ListDirectory(remoteDirectory);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, $"Failed in listing files under [{remoteDirectory}]");
            return null;
        }
    }

    public async Task UploadStop(byte[] bytes, string remoteFilePath)
    {
        try
        {
            await Connect();
            using (MemoryStream stream = new MemoryStream(bytes))
            {
                _sftpClient.UploadFile(stream, remoteFilePath); // stream file to DOJ SFTP 
            }

            _logger.LogInformation($"Finished uploading stop to [{remoteFilePath}]");
        }
        catch (Exception exception)
        {
            _logger.LogError($"Failed in uploading stop to [{remoteFilePath}] with exception {exception.Message}");
            throw new Exception($"Failed in uploading stop to [{remoteFilePath}] with exception {exception.Message}");
        }
    }

    public async Task<string> DownloadFileToBlobAsync(string remoteFilePath, string localFilePath, BlobContainerClient blobContainerClient)
    {

        try
        {
            BlobClient blobClient = blobContainerClient.GetBlobClient(localFilePath);
            await Connect();
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

    public async Task DeleteFile(string remoteFilePath)
    {
        try
        {
            await Connect();
            _sftpClient.DeleteFile(remoteFilePath);
            _logger.LogInformation($"File [{remoteFilePath}] deleted.");
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, $"Failed in deleting file [{remoteFilePath}]");
        }
    }
}
