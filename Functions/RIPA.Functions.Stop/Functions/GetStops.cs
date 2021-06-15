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
        [OpenApiParameter(name: "Status", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String Status: Unsubmitted, Submitted, Resubmitted, Failed")]
        [OpenApiParameter(name: "IsPII", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns Submitted Stops that have been flagged for PII")]
        [OpenApiParameter(name: "ErrorCode", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String ErrorCode: Error code must exist on stop submission to return")]
        [OpenApiParameter(name: "OfficerId", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Returns Submitted Stops where officer id")]
        [OpenApiParameter(name: "Offset", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "offsets the records from 0, requires limit parameter")]
        [OpenApiParameter(name: "Limit", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "limits the records")]
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

            //Get the query
            StopQuery stopQuery = new StopQuery
            {
                StartDate = !string.IsNullOrWhiteSpace(req.Query["StartDate"]) ? DateTime.Parse(req.Query["StartDate"]) : default,
                EndDate = !string.IsNullOrWhiteSpace(req.Query["EndDate"]) ? DateTime.Parse(req.Query["EndDate"]) : default,
                ErrorCode = !string.IsNullOrWhiteSpace(req.Query["ErrorCode"]) ? req.Query["ErrorCode"] : default,
                Status = !string.IsNullOrWhiteSpace(req.Query["Status"]) ? req.Query["Status"] : default,
                OfficerId = !string.IsNullOrWhiteSpace(req.Query["OfficerId"]) ? req.Query["OfficerId"] : default,
                Offset = !string.IsNullOrWhiteSpace(req.Query["offset"]) ? Convert.ToInt32(req.Query["offset"]) : default,
                Limit = !string.IsNullOrWhiteSpace(req.Query["limit"]) ? Convert.ToInt32(req.Query["limit"]) : default
            };

            if (!string.IsNullOrWhiteSpace(req.Query["isPii"]))
            {
                stopQuery.IsPII = bool.Parse(req.Query["isPii"]);
            }
            if (!string.IsNullOrWhiteSpace(req.Query["IsSubmitted"]))
            {
                stopQuery.IsSubmitted = bool.Parse(req.Query["IsSubmitted"]);
            }

            List<string> whereStatements = new List<string>();
            string join = string.Empty;

            //Date Range
            if (stopQuery.StartDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.StopDateTime > '{(DateTime)stopQuery.StartDate:o}'");
            }
            if (stopQuery.EndDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.StopDateTime < '{(DateTime)stopQuery.EndDate:o}'");
            }

            //IsPII
            if (stopQuery.IsPII != null)
            {
                whereStatements.Add(Environment.NewLine + $"c.IsPiiFound = {stopQuery.IsPII.ToString().ToLowerInvariant()}");
            }

            //Status
            if (!string.IsNullOrWhiteSpace(stopQuery.Status))
            {
                whereStatements.Add(Environment.NewLine + $"c.Status = '{stopQuery.Status}'");
            }

            //ErrorCode
            if (!string.IsNullOrWhiteSpace(stopQuery.ErrorCode))
            {
                join += Environment.NewLine + "JOIN ListSubmission IN c.ListSubmission";
                join += Environment.NewLine + "JOIN ListSubmissionError IN ListSubmission.ListSubmissionError";
                whereStatements.Add(Environment.NewLine + $"ListSubmissionError.Code = '{stopQuery.ErrorCode}'");
            }

            //IsSubmitted
            if (stopQuery.IsSubmitted != null)
            {
                if (!bool.Parse(stopQuery.IsSubmitted.ToString()))
                    whereStatements.Add(Environment.NewLine + $"c.Status = null");
                else
                    whereStatements.Add(Environment.NewLine + $"c.Status != null");
            }

            //OfficerId
            if (!string.IsNullOrWhiteSpace(stopQuery.OfficerId))
            {
                whereStatements.Add(Environment.NewLine + $"c.OfficerId = '{stopQuery.OfficerId}'");
            }

            //limit 
            var limit = string.Empty;
            if (stopQuery.Limit != 0)
            {
                limit = Environment.NewLine + $"OFFSET {stopQuery.Offset} LIMIT {stopQuery.Limit}";
            }

            string where = string.Empty;
            if (whereStatements.Count > 0)
            {
                where = " WHERE ";

                foreach (var whereStatement in whereStatements)
                {
                    where += Environment.NewLine + whereStatement;
                    where += Environment.NewLine + "AND";
                }
                where = where.Remove(where.Length - 3);
            }

            var order = Environment.NewLine + "ORDER BY c.StopDateTime DESC";

            var stopResponse = await _stopCosmosDbService.GetStopsAsync($"SELECT VALUE c FROM c {join} {where} {order} {limit}");

            var summary = await _stopCosmosDbService.GetStopStatusCounts($"SELECT COUNT(c.id) AS Count, c.Status AS Status FROM c {join} {where} GROUP BY c.Status");

            SummaryResponse summaryResponse = new SummaryResponse()
            {
                Total = summary.Sum(x => x.Count),
                Submitted = summary.Where(x => x.Status == "Submitted").Select(x => x.Count).FirstOrDefault(),
                Unsubmitted = summary.Where(x => x.Status == "Unsubmitted").Select(x => x.Count).FirstOrDefault(),
                Resubmitted = summary.Where(x => x.Status == "Resubmitted").Select(x => x.Count).FirstOrDefault(),
                Failed = summary.Where(x => x.Status == "Failed").Select(x => x.Count).FirstOrDefault(),
            };

            var response = new
            {
                stops = stopResponse,
                summary = summaryResponse
            };
            return new OkObjectResult(response);
        }

        public class SummaryResponse
        {
            public int Total { get; set; }
            public int Submitted { get; set; }
            public int Unsubmitted { get; set; }
            public int Failed { get; set; }
            public int Resubmitted { get; set; }
        }

    }
}

