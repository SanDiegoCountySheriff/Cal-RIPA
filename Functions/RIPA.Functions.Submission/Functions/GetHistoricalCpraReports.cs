using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
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

namespace RIPA.Functions.Submission.Functions
{
    public class GetHistoricalCpraReports
    {
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly BlobUtilities blobUtilities = new BlobUtilities();

        public GetHistoricalCpraReports()
        {
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = "cpra";
            _blobContainerClient = GetBlobContainerClient();
        }

        [FunctionName("GetHistoricalCpraReports")]
        [OpenApiOperation(operationId: "GetHistoricalCpraReports", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Getting Historical CPRA Reports");
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
            
            await _blobContainerClient.CreateIfNotExistsAsync();
            var blobs = _blobContainerClient.GetBlobsAsync();
            var response = new List<string>();

            await foreach (BlobItem blob in blobs)
            {
                response.Add(blob.Name);
            }

            return new OkObjectResult(response);
        }

        private BlobContainerClient GetBlobContainerClient()
        {
            BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
            string containerName = $"{_storageContainerNamePrefix}";
            BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
            return blobContainerClient;
        }
    }
}