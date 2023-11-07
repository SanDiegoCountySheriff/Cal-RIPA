using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure;
using System.IO;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Utility;

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

    public async Task UploadBlobCpraReport(byte[] bytes, string fileName, string directoryName, BlobContainerClient blobContainerClient)
    {
        BlobClient blobClient = blobContainerClient.GetBlobClient($"{directoryName}/{fileName}");
        using (MemoryStream stream = new MemoryStream(bytes))
        {
            await blobClient.UploadAsync(stream);
        }
    }

    public async Task DeleteBlobJson(string fileName, BlobContainerClient blobContainerClient)
    {
        BlobClient blobClient = blobContainerClient.GetBlobClient(fileName);
        await blobClient.DeleteIfExistsAsync();
    }

    public async Task<Response<BlobDownloadResult>> GetBlob(string fileName, BlobContainerClient blobContainerClient)
    {
        BlobClient blobClient = blobContainerClient.GetBlobClient(fileName);
        var file = await blobClient.DownloadContentAsync();
        return file;
    }
}
