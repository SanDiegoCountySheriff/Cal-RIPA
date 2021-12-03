using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.Stop.Utility;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.REST.Contracts;
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
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly IStopService _stopService;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly BlobUtilities blobUtilities = new BlobUtilities();

        public GenerateCpraReport(IStopCosmosDbService stopCosmosDbService, IStopService stopService)
        {
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixCpra");
            _blobContainerClient = GetBlobContainerClient();
            _stopCosmosDbService = stopCosmosDbService;
            _stopService = stopService;
        }

        [FunctionName("GenerateCpraReport")]
        [OpenApiOperation(operationId: "GenerateCpraReport", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = true, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = true, Type = typeof(DateTime), Description = "Ending DateTime for date range stops query")]
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

            await _blobContainerClient.CreateIfNotExistsAsync();

            byte[] fileBytes;
            string tempPath = $@"./{Guid.NewGuid()}.csv";
            var startDate = req.Query["StartDate"];
            var endDate = req.Query["EndDate"];
            var fileName = $"{startDate}-{endDate}-CPRAReport.csv";
            string stopQueryString;
            string stopSummaryQueryString;

            try
            {
                StopQueryUtility stopQueryUtility = new StopQueryUtility();
                StopQuery stopQuery = stopQueryUtility.GetStopQuery(req);
                stopQueryString = stopQueryUtility.GetStopsQueryString(stopQuery, true, true);
                stopSummaryQueryString = stopQueryUtility.GetStopsSummaryQueryString(stopQuery);
            }
            catch (Exception ex)
            {
                log.LogError("An error occurred while evaluating the stop query.", ex);
                return new BadRequestObjectResult("An error occurred while evaluating the stop query. Please try again.");
            }

            List<Stop> stopResponse;
            IEnumerable<StopStatusCount> stopStatuses;
            int totalStopCount = 0;

            try
            {
                stopResponse = await _stopCosmosDbService.GetStopsAsync(stopQueryString) as List<Stop>;
                stopStatuses = await _stopCosmosDbService.GetStopStatusCounts(stopSummaryQueryString);
                foreach (var stopStatus in stopStatuses)
                {
                    totalStopCount += stopStatus.Count;
                }
            }
            catch (Exception ex)
            {
                log.LogError("An error occurred getting stops requested.", ex);
                return new BadRequestObjectResult("An error occurred getting stops requested. Please try again.");
            }

            var builder = new StringBuilder();

            try 
            {
                foreach (var stop in stopResponse) 
                {
                    var dojStop = _stopService.CastToDojStop(stop);
                    dojStop.Officer = null;
                    var jsonStop = JsonConvert.SerializeObject(dojStop);
                    if (stop.Location.Beat != null) 
                    {
                        jsonStop += $"|{stop.Location.Beat.Codes.Text}";
                    }
                    jsonStop = jsonStop.Replace("\"", "\"\"");
                    builder.AppendLine($"\"{jsonStop}\"");
                }
            }
            catch (Exception ex)
            {
                log.LogError("An error occurred while parsing stops.", ex.Message);
            }

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

            try 
            {
                await blobUtilities.UploadBlobCpraReport(fileBytes, fileName, officerName, _blobContainerClient);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }

            var result = new CpraResult
            {
                FileName = $"{officerName}/{fileName}",
                CpraItems = new List<CpraListItem>
                {
                    new CpraListItem()
                    {
                        Level = 1,
                        Header = "Total stops in date range",
                        Detail = totalStopCount.ToString(),
                    },
                    new CpraListItem()
                    {
                        Level = 1,
                        Header = "Submitted stops included on report",
                        Detail = stopResponse.Count.ToString(),
                    },
                    new CpraListItem()
                    {
                        Level = 1,
                        Header = "From Date",
                        Detail = startDate,
                    },
                    new CpraListItem()
                    {
                        Level = 1,
                        Header = "To Date",
                        Detail = endDate,
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

