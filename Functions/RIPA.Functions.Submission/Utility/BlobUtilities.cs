using Azure.Storage.Blobs;
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
            try
            {
                BlobClient blobClient = blobContainerClient.GetBlobClient(fileName);
                using (MemoryStream stream = new MemoryStream(bytes))
                {
                    await blobClient.UploadAsync(stream); // stream file to Azure Blob
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception BLOB: {ex}");
            }
        }

    }
}
