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
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Functions
{
    public class GenerateCpraReport
    {
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly BlobUtilities blobUtilities = new BlobUtilities();

        public GenerateCpraReport()
        {
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixCpra");
            _blobContainerClient = GetBlobContainerClient();
        }

        [FunctionName("GenerateCpraReport")]
        [OpenApiOperation(operationId: "GenerateCpraReport", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiParameter(name: "FromDate", In = ParameterLocation.Query, Required = true, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "ToDate", In = ParameterLocation.Query, Required = true, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(string), Deprecated = false, Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(CpraResult), Description = "CPRA Report Result")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] string officerName, HttpRequest req,
            ILogger log)
        {
            log.LogInformation("CPRA Report Generation Requested");
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

            // TODO: try / catch

            byte[] fileBytes;
            string tempPath = $@"./{Guid.NewGuid()}.csv";
            var fromDate = req.Query["FromDate"];
            var toDate = req.Query["ToDate"];
            var fileName = $"{fromDate}-{toDate}-CPRAReport.csv";

            // TODO: Error check if file exists

            await _blobContainerClient.CreateIfNotExistsAsync();

            // TODO: Make it actually query the database to build the file
            var builder = new StringBuilder();
            builder.AppendLine("Hello,World");
            builder.AppendLine("hello,world");

            await File.WriteAllTextAsync(tempPath, builder.ToString(), Encoding.UTF8);

            using (StreamReader sr = new StreamReader(tempPath))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    sr.BaseStream.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }
            }

            File.Delete(tempPath);

            await blobUtilities.UploadBlobCpraReport(fileBytes, fileName, officerName, _blobContainerClient);

            var result = new CpraResult
            {
                FileName = $"{officerName}/{fileName}",
                CpraItems = new List<CpraListItem>
                {
                    new CpraListItem()
                    {
                        Level = 1,
                        Header = "Stop Count",
                        Detail = "2"
                    },
                    new CpraListItem()
                    {
                        Level = 1,
                        Header = "From Date",
                        Detail = fromDate
                    },
                    new CpraListItem()
                    {
                        Level = 1,
                        Header = "To Date",
                        Detail = toDate
                    }
                }
            };

            return new OkObjectResult(result);
        }

        private BlobContainerClient GetBlobContainerClient()
        {
            BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
            string containerName = $"{_storageContainerNamePrefix}";
            BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
            return blobContainerClient;
        }
    }

    public class CpraResult
    {
        public List<CpraListItem> CpraItems { get; set; }
        public string FileName { get; set; }
    }

    public class CpraListItem
    {
        public int Level { get; set; }
        public string Header { get; set; }
        public string Detail { get; set; }
    }
}

