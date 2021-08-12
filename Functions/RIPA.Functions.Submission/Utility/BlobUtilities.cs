using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Utility
{
    public class BlobUtilities
    {
        public async Task UploadBlobJson(byte[] bytes, string fileName, BlobContainerClient blobContainerClient)
        {

            BlobClient blobClient = blobContainerClient.GetBlobClient(fileName);
            using (MemoryStream stream = new MemoryStream(bytes))
            {
                await blobClient.UploadAsync(stream); // stream file to Azure Blob
            }
        }

        public async Task DeleteBlobJson(string fileName, BlobContainerClient blobContainerClient)
        {
            BlobClient blobClient = blobContainerClient.GetBlobClient(fileName);
            await blobClient.DeleteIfExistsAsync();
        }


    }
}
