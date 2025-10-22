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
        _lifecycleVerbose = (Environment.GetEnvironmentVariable("SftpLifecycleVerbose")?.Equals("true", StringComparison.OrdinalIgnoreCase)).GetValueOrDefault();
        if (_lifecycleVerbose)
        {
            _logger.LogInformation("SFTP lifecycle verbose logging ENABLED");
        }
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

    /// <summary>
    /// Health-check style connect. Establishes a connection and immediately disposes it.
    /// Keeps interface compatibility while preventing lingering sessions.
    /// </summary>
    public async Task Connect()
    {
        using var client = await ConnectNewAsync().ConfigureAwait(false);
        // Optionally perform a noop (like current working directory) to validate.
        _logger.LogDebug("SFTP health check successful. WorkingDirectory={wd}", client.WorkingDirectory);
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

    /// <summary>
    /// Creates, connects and returns a fresh SftpClient. Caller must dispose.
    /// Ensures no long-lived connections stay open.
    /// </summary>
    private readonly bool _lifecycleVerbose;

    private async Task<SftpClient> ConnectNewAsync(CancellationToken cancellationToken = default)
    {
        if (_disabled)
        {
            throw new InvalidOperationException("SFTP client disabled by configuration");
        }
        if (_disposed)
        {
            throw new ObjectDisposedException(nameof(SftpService));
        }

        var client = BuildClient();

        int attempt = 0;
        const int maxAttempts = 8;
        bool fatal = false;
        Exception? lastException = null;

        while (attempt < maxAttempts && !fatal && !client.IsConnected)
        {
            attempt++;
            try
            {
                _logger.LogInformation("[SFTP] Connecting attempt {attempt}/{max} host={host} user={user}", attempt, maxAttempts, _config.Host, _config.UserName);
                client.Connect();
                if (client.IsConnected)
                {
                    _logger.LogInformation("[SFTP] Connected (attempt {attempt}) sessionId={sessionId}", attempt, Guid.NewGuid());
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
                _logger.LogError(ex, "SFTP connection exception (transient) host={host} port={port} message={message}", _config.Host, _config.Port, ex.Message);
            }
            catch (SocketException ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP socket exception (transient) host={host} port={port} message={message}", _config.Host, _config.Port, ex.Message);
            }
            catch (ProxyException ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP proxy exception (transient) message={message}", ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP invalid operation (may be fatal)");
                fatal = true;
            }
            catch (Exception ex)
            {
                lastException = ex;
                _logger.LogError(ex, "SFTP unexpected exception");
            }

            if (!client.IsConnected && !fatal)
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

        if (!client.IsConnected)
        {
            client.Dispose();
            throw new SshConnectionException($"Failed to connect to SFTP after {attempt} attempts. Fatal={fatal}. Last error: {lastException?.Message}");
        }
        return client;
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }
        _disposed = true;
        _logger.LogInformation("Disposing SftpService (no active SFTP client retained)");
    }

    public async Task<IEnumerable<ISftpFile>> ListAllFiles(string remoteDirectory = ".")
    {
        using var client = await ConnectNewAsync().ConfigureAwait(false);
        var files = client.ListDirectory(remoteDirectory);
        if (_lifecycleVerbose)
        {
            _logger.LogInformation("[SFTP] Disconnect after ListAllFiles remoteDirectory={remoteDirectory}");
        }
        client.Disconnect();
        return files;
    }

    public async Task UploadStop(byte[] bytes, string remoteFilePath)
    {
        using var client = await ConnectNewAsync().ConfigureAwait(false);
        try
        {
            using var stream = new MemoryStream(bytes, writable: false);
            client.UploadFile(stream, remoteFilePath); // synchronous SSH.NET API
            _logger.LogInformation("Uploaded stop file to remote path {path}", remoteFilePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed uploading stop to {path}", remoteFilePath);
            throw;
        }
        finally
        {
            if (client.IsConnected)
            {
                if (_lifecycleVerbose)
                {
                    _logger.LogInformation("[SFTP] Disconnect after UploadStop path={path}", remoteFilePath);
                }
                client.Disconnect();
            }
        }
    }

    /// <summary>
    /// Upload a batch of stop files reusing a single SFTP connection.
    /// </summary>
    public async Task UploadStops(IEnumerable<(byte[] Content, string RemotePath)> files)
    {
        // Materialize to avoid multiple enumeration if caller passes LINQ.
        var fileList = files?.ToList() ?? new List<(byte[] Content, string RemotePath)>();
        if (!fileList.Any())
        {
            _logger.LogWarning("UploadStops invoked with empty file list");
            return;
        }

        using var client = await ConnectNewAsync().ConfigureAwait(false);
        int success = 0;
        foreach (var (content, remotePath) in fileList)
        {
            try
            {
                using var ms = new MemoryStream(content, writable: false);
                client.UploadFile(ms, remotePath);
                success++;
                _logger.LogDebug("Uploaded {remotePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed uploading batch file {remotePath}");
                // continue with remaining files
            }
        }
        _logger.LogInformation("Batch upload complete. {success}/{total} files succeeded", success, fileList.Count);
        if (client.IsConnected)
        {
            if (_lifecycleVerbose)
            {
                _logger.LogInformation("[SFTP] Disconnect after UploadStops count={count}", fileList.Count);
            }
            client.Disconnect();
        }
    }

    public async Task<string> DownloadFileToBlobAsync(string remoteFilePath, string localFilePath, BlobContainerClient blobContainerClient)
    {
        using var client = await ConnectNewAsync().ConfigureAwait(false);
        BlobClient blobClient = blobContainerClient.GetBlobClient(localFilePath);
        using var remoteStream = client.OpenRead(remoteFilePath);
        await blobClient.UploadAsync(remoteStream, overwrite: true).ConfigureAwait(false);
        var download = await blobClient.DownloadAsync().ConfigureAwait(false);
        using var streamReader = new StreamReader(download.Value.Content, leaveOpen: false);
        var text = await streamReader.ReadToEndAsync().ConfigureAwait(false);
        _logger.LogInformation("Transferred remote file {remote} to blob {blob}", remoteFilePath, localFilePath);
        if (client.IsConnected)
        {
            if (_lifecycleVerbose)
            {
                _logger.LogInformation("[SFTP] Disconnect after DownloadFile remote={remote} blob={blob}", remoteFilePath, localFilePath);
            }
            client.Disconnect();
        }
        return text;
    }

    public async Task DeleteFile(string remoteFilePath)
    {
        using var client = await ConnectNewAsync().ConfigureAwait(false);
        try
        {
            client.DeleteFile(remoteFilePath);
            _logger.LogInformation("Deleted remote file {path}", remoteFilePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed deleting remote file {path}", remoteFilePath);
            throw;
        }
        finally
        {
            if (client.IsConnected)
            {
                if (_lifecycleVerbose)
                {
                    _logger.LogInformation("[SFTP] Disconnect after DeleteFile path={path}", remoteFilePath);
                }
                client.Disconnect();
            }
        }
    }

    public async Task<ISftpBatch> BeginBatch()
    {
        var client = await ConnectNewAsync().ConfigureAwait(false);
        return new SftpBatch(_logger, client);
    }
}

internal sealed class SftpBatch : ISftpBatch
{
    private readonly ILogger _logger;
    private readonly SftpClient _client;
    private bool _disposed;
    private int _uploads;
    private int _deletes;

    public SftpBatch(ILogger logger, SftpClient client)
    {
        _logger = logger;
        _client = client;
    }

    public Task UploadStop(byte[] bytes, string remoteFilePath)
    {
        if (_disposed) throw new ObjectDisposedException(nameof(SftpBatch));
        try
        {
            using var ms = new MemoryStream(bytes, writable: false);
            _client.UploadFile(ms, remoteFilePath);
            _logger.LogInformation("[Batch] Uploaded stop file {path}", remoteFilePath);
            _uploads++;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Batch] Failed uploading stop to {path}", remoteFilePath);
            throw;
        }
        return Task.CompletedTask;
    }

    public Task DeleteFile(string remoteFilePath)
    {
        if (_disposed) throw new ObjectDisposedException(nameof(SftpBatch));
        try
        {
            _client.DeleteFile(remoteFilePath);
            _logger.LogInformation("[Batch] Deleted remote file {path}", remoteFilePath);
            _deletes++;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Batch] Failed deleting remote file {path}", remoteFilePath);
            throw;
        }
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        try
        {
            if (_client.IsConnected)
            {
                _logger.LogInformation("[Batch] Disconnecting SFTP session uploads={uploads} deletes={deletes}", _uploads, _deletes);
                _client.Disconnect();
            }
            _client.Dispose();
            _logger.LogInformation("Disposed SFTP batch session uploads={uploads} deletes={deletes}", _uploads, _deletes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error disposing SFTP batch session");
        }
    }
}
