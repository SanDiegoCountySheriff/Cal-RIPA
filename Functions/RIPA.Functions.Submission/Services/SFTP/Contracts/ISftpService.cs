using Azure.Storage.Blobs;
using Renci.SshNet.Sftp;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.SFTP.Contracts;

public interface ISftpService
{
    IEnumerable<SftpFile> ListAllFiles(string remoteDirectory = ".");
    void UploadStop(byte[] bytes, string remoteFilePath);
    Task<string> DownloadFileToBlobAsync(string remoteFilePath, string localFilePath, BlobContainerClient blobContainerClient);
    void DeleteFile(string remoteFilePath);
}
