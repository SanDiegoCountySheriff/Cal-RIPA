using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.Stop.Utility;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions
{
    public class GetStops
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public GetStops(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("GetStops")]
        [OpenApiOperation(operationId: "GetStops", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "Status", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String Status: Unsubmitted, Submitted, Failed")]
        [OpenApiParameter(name: "IsEdited", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns stops that have isEdited")]
        [OpenApiParameter(name: "IsPII", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns Submitted Stops that have been flagged for PII")]
        [OpenApiParameter(name: "ErrorCode", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String ErrorCode: Error code must exist on stop submission to return")]
        [OpenApiParameter(name: "OfficerId", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Returns Submitted Stops where officer id")]
        [OpenApiParameter(name: "Offset", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "offsets the records from 0, requires limit parameter")]
        [OpenApiParameter(name: "Limit", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "limits the records")]
        [OpenApiParameter(name: "OrderBy", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Column name to order the results")]
        [OpenApiParameter(name: "Order", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "ASC or DESC order")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(System.Collections.Generic.IEnumerable<Common.Models.Stop>), Description = "List of Stops")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
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

            string stopQueryString = String.Empty;
            string stopSummaryQueryString = String.Empty;
            try
            {
                StopQueryUtility stopQueryUtility = new StopQueryUtility();
                StopQuery stopQuery = stopQueryUtility.GetStopQuery(req);
                stopQueryString = stopQueryUtility.GetStopsQueryString(stopQuery, false);
                stopSummaryQueryString = stopQueryUtility.GetStopsSummaryQueryString(stopQuery);
            }
            catch (Exception ex)
            {
                log.LogError("An error occured while evaluating the stop query.", ex);
                return new BadRequestObjectResult("An error occured while evaluating the stop query. Please try again.");
            }

            IEnumerable<Common.Models.Stop> stopResponse;
            IEnumerable<Common.Models.StopStatusCount> stopStatusCounts;
            try
            {
                stopResponse = await _stopCosmosDbService.GetStopsAsync(stopQueryString);
                stopStatusCounts = await _stopCosmosDbService.GetStopStatusCounts(stopSummaryQueryString);
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
                    Unsubmitted = stopStatusCounts.Where(x => x.Status == "Unsubmitted").Select(x => x.Count).FirstOrDefault(),
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
            public int Failed { get; set; }
        }

    }
}

