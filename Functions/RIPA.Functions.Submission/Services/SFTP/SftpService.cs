using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using Renci.SshNet;
using Renci.SshNet.Common;
using Renci.SshNet.Sftp;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.SFTP;

public class SftpService : ISftpService, IDisposable
{
    public readonly ILogger<SftpService> _logger;
    public readonly SftpConfig _config;
    public readonly bool _disabled;
    private SftpClient? _sftpClient;
    private readonly object _syncRoot = new();
    private bool _disposed;

    public SftpService(ILogger<SftpService> logger)
    {
        var host = Environment.GetEnvironmentVariable("SftpHost");
        var portRaw = Environment.GetEnvironmentVariable("SftpPort");
        var userName = Environment.GetEnvironmentVariable("SftpUserName");
        var password = Environment.GetEnvironmentVariable("SftpPassword");
        var key = Environment.GetEnvironmentVariable("SftpKey");

        int port = 22;

        if (!string.IsNullOrWhiteSpace(portRaw) && int.TryParse(portRaw, out var parsedPort))
        {
            port = parsedPort;
        }

        _config = new SftpConfig
        {
            Host = host,
            Port = port,
            UserName = userName,
            Password = password,
            Key = key
        };

#if DEBUG
        var debugKeyPath = Environment.GetEnvironmentVariable("SftpDebugPrivateKeyPath");

        if (!string.IsNullOrWhiteSpace(debugKeyPath) && File.Exists(debugKeyPath))
        {
            _config.Key = File.ReadAllText(debugKeyPath);
            _logger.LogInformation("Loaded debug private key from {path}", debugKeyPath);
        }
#endif
        _logger = logger;
        var sftpDisabled = Environment.GetEnvironmentVariable("SftpDisabled");

        if (!string.IsNullOrEmpty(sftpDisabled) && bool.TryParse(sftpDisabled, out var disabled) && disabled)
        {
            _logger.LogWarning("Sftp is disabled by configuration");
            _disabled = true;
            return;
        }

        _logger.LogInformation("SftpService initialized with host={host}, port={port}, user={user}", _config.Host, _config.Port, _config.UserName);
        ValidateInitialConfig();
    }

    private void ValidateInitialConfig()
    {
        if (string.IsNullOrWhiteSpace(_config.Host))
        {
            _logger.LogWarning("SFTP host is not configured");
        }
        if (string.IsNullOrWhiteSpace(_config.UserName))
        {
            _logger.LogWarning("SFTP username is not configured");
        }
        if (string.IsNullOrWhiteSpace(_config.Key))
        {
            _logger.LogWarning("SFTP private key is not configured (environment variable SftpKey)");
        }
        else if (!_config.Key.Contains("BEGIN") || !_config.Key.Contains("PRIVATE KEY"))
        {
            _logger.LogWarning("SFTP key may be malformed: missing BEGIN/PRIVATE KEY header");
        }
    }

    public async Task Connect()
    {
        await EnsureConnectedAsync().ConfigureAwait(false);
    }

    private SftpClient BuildClient()
    {
        var methods = new List<AuthenticationMethod>();
        if (!string.IsNullOrWhiteSpace(_config.Key))
        {
            var keyBytes = Encoding.UTF8.GetBytes(_config.Key);
            using var ms = new MemoryStream(keyBytes);
            try
            {
                var pkFile = string.IsNullOrWhiteSpace(_config.Password)
                    ? new PrivateKeyFile(ms)
                    : new PrivateKeyFile(ms, _config.Password); // passphrase only, not account password
                methods.Add(new PrivateKeyAuthenticationMethod(_config.UserName, pkFile));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to parse private key for SFTP authentication");
            }
        }

        if (!string.IsNullOrWhiteSpace(_config.Password))
        {
            methods.Add(new PasswordAuthenticationMethod(_config.UserName, _config.Password));
        }

        if (!methods.Any())
        {
            _logger.LogWarning("No authentication methods configured for SFTP; connection will fail.");
        }

        var connectionInfo = new ConnectionInfo(_config.Host, _config.Port, _config.UserName, methods.ToArray())
        {
            Timeout = TimeSpan.FromSeconds(15)
        };

        var client = new SftpClient(connectionInfo)
        {
            KeepAliveInterval = TimeSpan.FromSeconds(30)
        };

        client.HostKeyReceived += (_, e) =>
        {
            _logger.LogInformation("Host key received: algo={algo}, fingerprint={fingerprint}", e.HostKeyName, BitConverter.ToString(e.FingerPrint));
        };

        return client;
    }

    private async Task EnsureConnectedAsync(CancellationToken cancellationToken = default)
    {
        if (_disabled)
        {
            throw new InvalidOperationException("SFTP client disabled by configuration");
        }

        if (_disposed)
        {
            throw new ObjectDisposedException(nameof(SftpService));
        }

        if (_sftpClient != null && _sftpClient.IsConnected)
        {
            return;
        }

        lock (_syncRoot)
        {
            if (_sftpClient == null)
            {
                _sftpClient = BuildClient();
            }
        }

        if (_sftpClient!.IsConnected)
        {
            return;
        }

        int attempt = 0;
        const int maxAttempts = 8;
        bool fatal = false;
        Exception? lastException = null;

        while (attempt < maxAttempts && !fatal && !_sftpClient.IsConnected)
        {
            attempt++;

            try
            {
                _logger.LogInformation("Attempting SFTP connection attempt {attempt}/{max}", attempt, maxAttempts);
                _sftpClient.Connect();

                if (_sftpClient.IsConnected)
                {
                    _logger.LogInformation("SFTP connected successfully on attempt {attempt}", attempt);
                    break;
                }
            }
            catch (SshAuthenticationException ex)
            {
                fatal = true;
                lastException = ex;
                _logger.LogError(ex, "SFTP authentication failed (fatal). Username={user}", _config.UserName);
            }
            catch (SshConnectionException ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP connection exception (transient) host={host} port={port}", _config.Host, _config.Port);
            }
            catch (SocketException ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP socket exception (transient) host={host} port={port}", _config.Host, _config.Port);
            }
            catch (ProxyException ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP proxy exception (transient)");
            }
            catch (InvalidOperationException ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP invalid operation (may be fatal) state={connected}", _sftpClient.IsConnected);
                fatal = true;
            }
            catch (Exception ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP unexpected exception");
            }

            if (!_sftpClient.IsConnected && !fatal)
            {
                var delayMs = Math.Min(5000, attempt * 1000);
                _logger.LogDebug("SFTP will retry in {delay}ms", delayMs);

                try
                {
                    await Task.Delay(delayMs, cancellationToken).ConfigureAwait(false);
                }
                catch (TaskCanceledException)
                {
                    _logger.LogWarning("SFTP connection attempt canceled");
                    break;
                }
            }
        }

        if (!_sftpClient.IsConnected)
        {
            throw new SshConnectionException($"Failed to connect to SFTP after {attempt} attempts. Fatal={fatal}. Last error: {lastException?.Message}");
        }
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;

        _logger.LogInformation("Disposing SftpService and disconnecting SFTP client");

        try
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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception while disposing SFTP client");
        }
    }

    public async Task<IEnumerable<ISftpFile>> ListAllFiles(string remoteDirectory = ".")
    {
        await EnsureConnectedAsync();

        return _sftpClient!.ListDirectory(remoteDirectory);
    }

    public async Task UploadStop(byte[] bytes, string remoteFilePath)
    {
        await EnsureConnectedAsync();

        try
        {
            using var stream = new MemoryStream(bytes, writable: false);
            _sftpClient!.UploadFile(stream, remoteFilePath); // synchronous SSH.NET API
            _logger.LogInformation("Uploaded stop file to remote path {path}", remoteFilePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed uploading stop to {path}", remoteFilePath);
            throw;
        }
    }

    public async Task<string> DownloadFileToBlobAsync(string remoteFilePath, string localFilePath, BlobContainerClient blobContainerClient)
    {
        await EnsureConnectedAsync();

        BlobClient blobClient = blobContainerClient.GetBlobClient(localFilePath);
        using var remoteStream = _sftpClient!.OpenRead(remoteFilePath);

        await blobClient.UploadAsync(remoteStream, overwrite: true).ConfigureAwait(false);

        var download = await blobClient.DownloadAsync().ConfigureAwait(false);

        using var streamReader = new StreamReader(download.Value.Content, leaveOpen: false);

        var text = await streamReader.ReadToEndAsync().ConfigureAwait(false);

        _logger.LogInformation("Transferred remote file {remote} to blob {blob}", remoteFilePath, localFilePath);

        return text;
    }

    public async Task DeleteFile(string remoteFilePath)
    {
        await EnsureConnectedAsync();

        try
        {
            _sftpClient!.DeleteFile(remoteFilePath);
            _logger.LogInformation("Deleted remote file {path}", remoteFilePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed deleting remote file {path}", remoteFilePath);
            throw;
        }
    }
}
