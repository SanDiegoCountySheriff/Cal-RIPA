﻿using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using Renci.SshNet.Sftp;
using RIPA.Functions.Submission.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.SFTP.Contracts
{
    public interface ISftpService
    {
        IEnumerable<SftpFile> ListAllFiles(string remoteDirectory = ".");
        void UploadFile(string localFilePath, string remoteFilePath);
        void UploadStop(DojStop stop, string remoteFilePath, string fileName, BlobContainerClient blobContainerClient);
        void UploadJsonString(string jsonString, string remoteFilePath);
        Task<string> DownloadFileToBlobAsync(string remoteFilePath, string localFilePath, BlobContainerClient blobContainerClient);
        void DeleteFile(string remoteFilePath);
    }
}
