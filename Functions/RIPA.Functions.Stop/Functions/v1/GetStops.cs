using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.Stop.Utility;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v1;

public class GetStops
{
    private readonly IStopCosmosDbService<Common.Models.v1.Stop> _stopV1CosmosDbService;
    private readonly IStopCosmosDbService<Common.Models.v2.Stop> _stopV2CosmosDbService;

    public GetStops(IStopCosmosDbService<Common.Models.v1.Stop> stopV1CosmosDbService, IStopCosmosDbService<Common.Models.v2.Stop> stopV2CosmosDbService)
    {
        _stopV1CosmosDbService = stopV1CosmosDbService;
        _stopV2CosmosDbService = stopV2CosmosDbService;
    }

    [FunctionName("GetStops_v1")]
    [OpenApiOperation(operationId: "v1/GetStops", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
    [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
    [OpenApiParameter(name: "Statuses", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Comma Separated Statuses: Unsubmitted, Submitted, Failed, Resubmitted")]
    [OpenApiParameter(name: "IsEdited", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns stops that have isEdited")]
    [OpenApiParameter(name: "IsPII", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns Submitted Stops that have been flagged for PII")]
    [OpenApiParameter(name: "ErrorCode", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String ErrorCode: Error code must exist on stop submission to return")]
    [OpenApiParameter(name: "OfficerId", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Returns Submitted Stops where officer id")]
    [OpenApiParameter(name: "Offset", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "offsets the records from 0, requires limit parameter")]
    [OpenApiParameter(name: "Limit", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "limits the records")]
    [OpenApiParameter(name: "OrderBy", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Column name to order the results")]
    [OpenApiParameter(name: "Order", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "ASC or DESC order")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(IEnumerable<Common.Models.v1.Stop>), Description = "List of Stops")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/GetStops")] HttpRequest req, ILogger log)
    {
        log.LogInformation("GET - Get Stops requested");

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

        string stopV1QueryString = string.Empty;
        string stopV2QueryString = string.Empty;
        string stopSummaryQueryString = string.Empty;

        try
        {
            StopQueryUtility stopQueryUtility = new StopQueryUtility();
            StopQuery stopQuery = stopQueryUtility.GetStopQuery(req);
            stopV1QueryString = stopQueryUtility.GetStopsQueryString(stopQuery, true, 1);
            stopV2QueryString = stopQueryUtility.GetStopsQueryString(stopQuery, true, 2);
            stopSummaryQueryString = stopQueryUtility.GetStopsSummaryQueryString(stopQuery);
        }
        catch (Exception ex)
        {
            log.LogError("An error occured while evaluating the stop query.", ex);
            return new BadRequestObjectResult("An error occured while evaluating the stop query. Please try again.");
        }

        List<IStop> stopResponse = new();
        IEnumerable<StopStatusCount> stopStatusCounts;

        try
        {
            stopResponse.AddRange(await _stopV1CosmosDbService.GetStopsAsync(stopV1QueryString));
            stopResponse.AddRange(await _stopV2CosmosDbService.GetStopsAsync(stopV2QueryString));

            stopStatusCounts = await _stopV1CosmosDbService.GetStopStatusCounts(stopSummaryQueryString);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "An error occurred getting stops requested.");
            return new BadRequestObjectResult("An error occurred getting stops requested. Please try again.");
        }

        var response = new
        {
            stops = stopResponse,
            summary = new SummaryResponse()
            {
                Total = stopStatusCounts.Sum(x => x.Count),
                Submitted = stopStatusCounts.Where(x => x.Status == "Submitted").Select(x => x.Count).FirstOrDefault(),
                Resubmitted = stopStatusCounts.Where(x => x.Status == "Resubmitted").Select(x => x.Count).FirstOrDefault(),
                Unsubmitted = stopStatusCounts.Where(x => x.Status == "Unsubmitted").Select(x => x.Count).FirstOrDefault(),
                Pending = stopStatusCounts.Where(x => x.Status == "Pending").Select(x => x.Count).FirstOrDefault(),
                Failed = stopStatusCounts.Where(x => x.Status == "Failed").Select(x => x.Count).FirstOrDefault(),
            }
        };

        return new OkObjectResult(response);
    }

    public class SummaryResponse
    {
        public int Total { get; set; }
        public int Submitted { get; set; }
        public int Unsubmitted { get; set; }
        public int Resubmitted { get; set; }
        public int Pending { get; set; }
        public int Failed { get; set; }
    }
}