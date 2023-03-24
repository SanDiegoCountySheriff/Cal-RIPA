using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Functions.v1;

public class GetSubmissions
{
    private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
    private readonly IStopCosmosDbService _stopCosmosDbService;

    public GetSubmissions(ISubmissionCosmosDbService submissionCosmosDbService, IStopCosmosDbService stopCosmosDbService)
    {
        _submissionCosmosDbService = submissionCosmosDbService;
        _stopCosmosDbService = stopCosmosDbService;
    }

    [FunctionName("v1/GetSubmissions")]
    [OpenApiOperation(operationId: "v1/GetSubmissions", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(IEnumerable<Models.Submission>), Description = "List of Submissions")]
    [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range submission query")]
    [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range submission query")]
    [OpenApiParameter(name: "Offset", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "offsets the records from 0, requires limit parameter")]
    [OpenApiParameter(name: "Limit", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "limits the records")]
    [OpenApiParameter(name: "OrderBy", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Column name to order the results")]
    [OpenApiParameter(name: "Order", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "ASC or DESC order")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/GetSubmissions")] HttpRequest req, ILogger log)
    {
        log.LogInformation("GET - Get Submissions requested");
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

        SubmissionQuery submissionQuery = new SubmissionQuery()
        {
            StartDate = !string.IsNullOrWhiteSpace(req.Query["StartDate"]) ? DateTime.Parse(req.Query["StartDate"]) : DateTime.MinValue,
            EndDate = !string.IsNullOrWhiteSpace(req.Query["EndDate"]) ? DateTime.Parse(req.Query["EndDate"]) : DateTime.MaxValue,
            Offset = !string.IsNullOrWhiteSpace(req.Query["offset"]) ? Convert.ToInt32(req.Query["offset"]) : default,
            Limit = !string.IsNullOrWhiteSpace(req.Query["limit"]) ? Convert.ToInt32(req.Query["limit"]) : default,
            OrderBy = !string.IsNullOrWhiteSpace(req.Query["OrderBy"]) ? req.Query["OrderBy"] : default,
            Order = !string.IsNullOrWhiteSpace(req.Query["Order"]) ? req.Query["Order"] : default,
        };

        List<string> whereStatements = new List<string>();

        //Date Range
        //min stop date is less than start and the max stop is greater and start
        whereStatements.Add(Environment.NewLine + $"(c.MinStopDate <= '{(DateTime)submissionQuery.StartDate:o}' AND c.MaxStopDate >= '{(DateTime)submissionQuery.StartDate:o}')");
        //min stop is less than the end and the max stop is greater than the end
        whereStatements.Add(Environment.NewLine + $"(c.MinStopDate <= '{(DateTime)submissionQuery.EndDate:o}' AND c.MaxStopDate >= '{(DateTime)submissionQuery.EndDate:o}')");
        //min stop date is greater than start and less than end
        whereStatements.Add(Environment.NewLine + $"(c.MinStopDate >= '{(DateTime)submissionQuery.StartDate:o}' AND c.MinStopDate <= '{(DateTime)submissionQuery.EndDate:o}')");
        //max stop date is greater than start and less than end
        whereStatements.Add(Environment.NewLine + $"(c.MaxStopDate >= '{(DateTime)submissionQuery.StartDate:o}' AND c.MaxStopDate <= '{(DateTime)submissionQuery.EndDate:o}')");

        string where = string.Empty;
        if (whereStatements.Count > 0)
        {
            where = " WHERE ";
            foreach (var whereStatement in whereStatements)
            {
                where += Environment.NewLine + whereStatement;
                where += Environment.NewLine + "OR";
            }
            where = where.Remove(where.Length - 2);
        }

        //limit 
        var limit = string.Empty;
        if (submissionQuery.Limit != 0)
        {
            limit = Environment.NewLine + $"OFFSET {submissionQuery.Offset} LIMIT {submissionQuery.Limit}";
        }

        var order = Environment.NewLine + "ORDER BY c.dateSubmitted DESC";
        if (!string.IsNullOrWhiteSpace(submissionQuery.OrderBy))
        {
            order = Environment.NewLine + $"ORDER BY c.{submissionQuery.OrderBy} ";
            if (!string.IsNullOrWhiteSpace(submissionQuery.Order))
            {
                if (submissionQuery.Order.ToUpperInvariant() == "DESC" || submissionQuery.Order.ToUpperInvariant() == "ASC")
                {
                    order += submissionQuery.Order;
                }
            }
        }

        try
        {
            var submissions = await _submissionCosmosDbService.GetSubmissionsAsync($"SELECT * FROM c {where} {order} {limit}");
            var count = await _submissionCosmosDbService.GetSubmissionsCountAsync($"SELECT VALUE Count(1) FROM c {where}");

            List<object> list = new List<object>() { };

            foreach (var submission in submissions)
            {
                list.Add(new
                {
                    submission.Id,
                    submission.DateSubmitted,
                    submission.RecordCount,
                    submission.OfficerName,
                    submission.OfficerId,
                    submission.MaxStopDate,
                    submission.MinStopDate,
                    ErrorCount = (await _stopCosmosDbService.GetSubmissionErrorSummaries(submission.Id.ToString())).Sum(x => x.Count)
                });
            }

            var response = new
            {
                submissions = list,
                total = count
            };

            return new OkObjectResult(response);
        }
        catch (Exception ex)
        {
            log.LogError($"Error getting submissions: {ex.Message}");
            return new BadRequestObjectResult($"Error getting submissions: {ex.Message}");
        }

    }

    public class SubmissionQuery
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Limit { get; set; }
        public int Offset { get; set; }
        public string OrderBy { get; set; }
        public string Order { get; set; }
    }
}
