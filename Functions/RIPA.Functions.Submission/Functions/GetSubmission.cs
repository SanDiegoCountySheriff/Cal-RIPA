using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;

namespace RIPA.Functions.Submission.Functions
{
    public class GetSubmission
    {
        private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public GetSubmission(ISubmissionCosmosDbService submissionCosmosDbService, IStopCosmosDbService stopCosmosDbService)
        {
            _submissionCosmosDbService = submissionCosmosDbService;
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("GetSubmission")]
        [OpenApiOperation(operationId: "GetSubmission", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Submission Id")]
        [OpenApiParameter(name: "Offset", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "offsets the records from 0, requires limit parameter")]
        [OpenApiParameter(name: "Limit", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "limits the records")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Models.Submission), Description = "Subission Object")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Submission Id not found")]
        [OpenApiParameter(name: "OrderBy", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Column name to order the results")]
        [OpenApiParameter(name: "Order", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "ASC or DESC order")]

        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetSubmission/{Id}")] HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("GET - Get Submission requested");
            try
            {
                if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
                {
                    return new UnauthorizedResult();
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new UnauthorizedResult();
            }

            //limit 
            var queryLimit = !string.IsNullOrWhiteSpace(req.Query["limit"]) ? Convert.ToInt32(req.Query["limit"]) : default;
            var queryOffset = !string.IsNullOrWhiteSpace(req.Query["offset"]) ? Convert.ToInt32(req.Query["offset"]) : default;
            var limit = string.Empty;
            if (queryLimit != 0)
            {
                limit = Environment.NewLine + $"OFFSET {queryOffset} LIMIT {queryLimit}";
            }

            var queryOrderBy = !string.IsNullOrWhiteSpace(req.Query["OrderBy"]) ? req.Query["OrderBy"] : default;
            var queryOrder = !string.IsNullOrWhiteSpace(req.Query["Order"]) ? req.Query["Order"] : default;

            var order = Environment.NewLine + "ORDER BY c.StopDateTime DESC";
            if (!string.IsNullOrWhiteSpace(queryOrderBy))
            {
                order = Environment.NewLine + $"ORDER BY c.{queryOrderBy} ";
                if (!string.IsNullOrWhiteSpace(queryOrder))
                {
                    if (queryOrder.ToString().ToUpperInvariant() == "DESC" || queryOrder.ToString().ToUpperInvariant() == "ASC")
                        order += queryOrder;
                }
            }

            if (!string.IsNullOrEmpty(Id))
            {
                var submissionResponse = await _submissionCosmosDbService.GetSubmissionAsync(Id);
                if (submissionResponse != null)
                {
                    string query = $"SELECT VALUE c FROM c JOIN Submission IN c.ListSubmission WHERE Submission.Id = '{Id}' {order} {limit}";

                    var stopResponse = await _stopCosmosDbService.GetStopsAsync(query);
                    var getSubmissionStopDateTimeSummaryResponse = await _stopCosmosDbService.GetSubmissionStopDateTimeSummaries(Id);
                    var getSubmissionErrorSummariesResponse = await _stopCosmosDbService.GetSubmissionErrorSummaries(Id);
                    var response = new
                    {
                        submission = new {
                            submissionResponse.Id,
                            submissionResponse.DateSubmitted,
                            submissionResponse.RecordCount,
                            MaxStopDate = getSubmissionStopDateTimeSummaryResponse.FirstOrDefault().MaxStopDateTime,
                            MinStopDate = getSubmissionStopDateTimeSummaryResponse.FirstOrDefault().MinStopDateTime
                        },
                        stops = stopResponse,
                        summary = getSubmissionErrorSummariesResponse
                    };
                   
                    return new OkObjectResult(response);
                }
            }
            return new BadRequestObjectResult("Submission Id not found");
        }
    }
}

