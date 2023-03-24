using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Utility;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Functions.v1;

public class DownloadCpraReport
{
    private readonly string _storageConnectionString;
    private readonly string _storageContainerNamePrefix;
    private readonly BlobContainerClient _blobContainerClient;
    private readonly BlobUtilities blobUtilities = new BlobUtilities();

    public DownloadCpraReport()
    {
        _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
        _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixCpra");
        _blobContainerClient = GetBlobContainerClient();
    }

    [FunctionName("v1/DownloadCpraReport")]
    [OpenApiOperation(operationId: "v1/DownloadCpraReport", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "FileName", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "The FileName parameter")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/octet-stream", bodyType: typeof(FileContentResult), Description = "The file")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/DownloadCpraReport")] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("Downloading CPRA report");

        try
        {
            if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);

            return new UnauthorizedResult();
        }

        var fileName = req.Query["FileName"];

        try
        {
            var resultFile = await blobUtilities.GetBlob(fileName, _blobContainerClient);

            return new FileContentResult(resultFile.Value.Content.ToArray(), "application/octet-stream")
            {
                FileDownloadName = fileName
            };
        }
        catch (Exception ex)
        {
            log.LogError($"Error downloading CPRA Report {fileName}: {ex.Message}");
            return new NotFoundResult();
        }
    }

    private BlobContainerClient GetBlobContainerClient()
    {
        BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
        BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(_storageContainerNamePrefix);

        return blobContainerClient;
    }
}
