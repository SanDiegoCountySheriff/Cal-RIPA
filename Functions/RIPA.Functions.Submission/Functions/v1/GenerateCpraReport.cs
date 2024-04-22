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
using RIPA.Functions.Common.Models.v1;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.Stop.Utility;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Utility;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Functions.v1;

public class GenerateCpraReport
{
    private readonly string _storageConnectionString;
    private readonly string _storageContainerNamePrefix;
    private readonly IStopCosmosDbService<Stop> _stopCosmosDbService;
    private readonly IStopCosmosDbService<Common.Models.v2.Stop> _stopCosmosDbServiceV2;
    private readonly Services.REST.v1.Contracts.IStopService _stopService;
    private readonly Services.REST.v2.Contracts.IStopService _stopServiceV2;
    private readonly BlobContainerClient _blobContainerClient;
    private readonly BlobUtilities blobUtilities = new BlobUtilities();

    public GenerateCpraReport(IStopCosmosDbService<Stop> stopCosmosDbService, IStopCosmosDbService<Common.Models.v2.Stop> stopCosmosDbServiceV2, Services.REST.v1.Contracts.IStopService stopService, Services.REST.v2.Contracts.IStopService stopServiceV2)
    {
        _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
        _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixCpra");
        _blobContainerClient = GetBlobContainerClient();
        _stopCosmosDbService = stopCosmosDbService;
        _stopCosmosDbServiceV2 = stopCosmosDbServiceV2;
        _stopService = stopService;
        _stopServiceV2 = stopServiceV2;
    }

    [FunctionName("GenerateCpraReport_v1")]
    [OpenApiOperation(operationId: "v1/GenerateCpraReport", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = true, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
    [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = true, Type = typeof(DateTime), Description = "Ending DateTime for date range stops query")]
    [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(string), Deprecated = false, Required = true)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(CpraResult), Description = "CPRA Report Result")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/GenerateCpraReport")] string officerName, HttpRequest req,
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
        string tempPath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.csv");
        var startDate = req.Query["StartDate"];
        var endDate = req.Query["EndDate"];
        var fileName = $"{startDate}-{endDate}-CPRAReport.csv";
        string stopQueryStringV1;
        string stopSummaryQueryStringV1;
        string stopQueryStringV2;
        string stopSummaryQueryStringV2;

        try
        {
            StopQueryUtility stopQueryUtility = new StopQueryUtility();
            StopQuery stopQuery = stopQueryUtility.GetStopQuery(req);
            stopQueryStringV1 = stopQueryUtility.GetStopsQueryString(stopQuery, true, 1, true);
            stopSummaryQueryStringV1 = stopQueryUtility.GetStopsSummaryQueryString(stopQuery, 1);
            stopQueryStringV2 = stopQueryUtility.GetStopsQueryString(stopQuery, true, 2, true);
            stopSummaryQueryStringV2 = stopQueryUtility.GetStopsSummaryQueryString(stopQuery, 2);
        }
        catch (Exception ex)
        {
            log.LogError($"An error occurred while evaluating the stop query: {ex.Message}");
            return new BadRequestObjectResult("An error occurred while evaluating the stop query. Please try again.");
        }

        List<Stop> stopResponseV1;
        List<Common.Models.v2.Stop> stopResponseV2;
        IEnumerable<StopStatusCount> stopStatusesV1;
        IEnumerable<StopStatusCount> stopStatusesV2;
        int totalStopCount = 0;

        try
        {
            stopResponseV1 = await _stopCosmosDbService.GetStopsAsync(stopQueryStringV1) as List<Stop>;
            stopStatusesV1 = await _stopCosmosDbService.GetStopStatusCounts(stopSummaryQueryStringV1);
            stopResponseV2 = await _stopCosmosDbServiceV2.GetStopsAsync(stopQueryStringV2) as List<Common.Models.v2.Stop>;
            stopStatusesV2 = await _stopCosmosDbServiceV2.GetStopStatusCounts(stopSummaryQueryStringV2);

            foreach (var stopStatus in stopStatusesV1)
            {
                totalStopCount += stopStatus.Count;
            }

            foreach (var stopStatus in stopStatusesV2)
            {
                totalStopCount += stopStatus.Count;
            }
        }
        catch (Exception ex)
        {
            log.LogError($"An error occurred getting stops requested: {ex.Message}");
            return new BadRequestObjectResult("An error occurred getting stops requested. Please try again.");
        }

        if (totalStopCount == 0)
        {
            return new OkObjectResult("No valid stops were found during that date range.");
        }

        var builder = new StringBuilder();

        try
        {
            foreach (var stop in stopResponseV1)
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

            foreach (var stop in stopResponseV2)
            {
                var dojStop = _stopServiceV2.CastToDojStop(stop);
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
            log.LogError($"Error uploading CPRA report to blob: {ex.Message}");
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
                    Detail = (stopResponseV1.Count + stopResponseV2.Count).ToString(),
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
        BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(_storageContainerNamePrefix);

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

