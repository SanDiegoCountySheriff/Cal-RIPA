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
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Functions;

public class GetSubmission
{
    private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
    private readonly IStopCosmosDbService<Common.Models.v1.Stop> _stopV1CosmosDbService;
    private readonly IStopCosmosDbService<Common.Models.v2.Stop> _stopV2CosmosDbService;

    public GetSubmission(
        ISubmissionCosmosDbService submissionCosmosDbService,
        IStopCosmosDbService<Common.Models.v1.Stop> stopV1CosmosDbService,
        IStopCosmosDbService<Common.Models.v2.Stop> stopV2CosmosDbService
    )
    {
        _submissionCosmosDbService = submissionCosmosDbService;
        _stopV1CosmosDbService = stopV1CosmosDbService;
        _stopV2CosmosDbService = stopV2CosmosDbService;
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
    [OpenApiParameter(name: "ErrorCode", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "The full text error code to filter the submissions stops by")]

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
                {
                    order += queryOrder;
                }
            }
        }

        List<string> whereStatements = new();
        string join = string.Empty;
        join += Environment.NewLine + "JOIN ListSubmission IN c.ListSubmission";
        whereStatements.Add(Environment.NewLine + $"ListSubmission.Id = '{Id}'");

        if (!string.IsNullOrWhiteSpace(req.Query["ErrorCode"]))
        {
            join += Environment.NewLine + "JOIN ListSubmissionError IN ListSubmission.ListSubmissionError";
            whereStatements.Add(Environment.NewLine + $"ListSubmissionError.Code = '{req.Query["ErrorCode"]}'");
        }

        string whereV1 = "WHERE ";
        string whereV2 = "WHERE ";

        if (whereStatements.Count > 0)
        {
            foreach (var whereStatement in whereStatements)
            {
                whereV1 += Environment.NewLine + whereStatement;
                whereV1 += Environment.NewLine + "AND";
            }

            whereV1 += " (c.StopVersion = 1 OR NOT IS_DEFINED(c.StopVersion))";
        }

        if (whereStatements.Count > 0)
        {
            foreach (var whereStatement in whereStatements)
            {
                whereV2 += Environment.NewLine + whereStatement;
                whereV2 += Environment.NewLine + "AND";
            }

            whereV2 += " c.StopVersion = 2";
        }

        try
        {
            var submissionResponse = await _submissionCosmosDbService.GetSubmissionAsync(Id);
            string queryV1 = $"SELECT VALUE c FROM c {join} {whereV1} {order} {limit}";
            string queryV2 = $"SELECT VALUE c FROM c {join} {whereV2} {order} {limit}";
            List<IStop> stopResponse = new();
            stopResponse.AddRange(await _stopV1CosmosDbService.GetStopsAsync(queryV1));
            stopResponse.AddRange(await _stopV2CosmosDbService.GetStopsAsync(queryV2));
            List<SubmissionErrorSummary> submissionErrorSummaries = new();
            submissionErrorSummaries.AddRange(await _stopV1CosmosDbService.GetSubmissionErrorSummaries(Id, 1));
            submissionErrorSummaries.AddRange(await _stopV2CosmosDbService.GetSubmissionErrorSummaries(Id, 2));
            var response = new
            {
                submission = new
                {
                    submissionResponse.Id,
                    submissionResponse.DateSubmitted,
                    submissionResponse.RecordCount,
                    submissionResponse.OfficerId,
                    submissionResponse.OfficerName,
                    submissionResponse.MaxStopDate,
                    submissionResponse.MinStopDate,
                    ErrorCount = submissionErrorSummaries.Sum(x => x.Count)
                },
                stops = stopResponse,
                summary = submissionErrorSummaries

            };

            return new OkObjectResult(response);
        }
        catch (Exception ex)
        {
            log.LogError($"Error getting submission: {ex.Message}");
            return new BadRequestObjectResult($"Error getting submission: {ex.Message}");
        }
    }
}
