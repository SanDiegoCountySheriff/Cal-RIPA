using Azure.Storage.Blobs;
using Renci.SshNet.Sftp;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.SFTP.Contracts;

public interface ISftpService
{
    Task<IEnumerable<ISftpFile>> ListAllFiles(string remoteDirectory = ".");
    Task UploadStop(byte[] bytes, string remoteFilePath);
    Task<string> DownloadFileToBlobAsync(string remoteFilePath, string localFilePath, BlobContainerClient blobContainerClient);
    Task DeleteFile(string remoteFilePath);
    Task Connect();
    void Dispose();
}
