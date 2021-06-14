using System;
using System.Collections.Generic;
using System.IO;
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
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;

namespace RIPA.Functions.Submission.Functions
{
    public class GetSubmissions
    {
        private readonly ISubmissionCosmosDbService _submissionCosmosDbService;

        public GetSubmissions(ISubmissionCosmosDbService submissionCosmosDbService)
        {
            _submissionCosmosDbService = submissionCosmosDbService;
        }

        [FunctionName("GetSubmissions")]
        [OpenApiOperation(operationId: "GetSubmissions", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(System.Collections.Generic.IEnumerable<Models.Submission>), Description = "List of Submissions")]
        [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range submission query")]
        [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range submission query")]
        [OpenApiParameter(name: "Offset", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "offsets the records from 0, requires limit parameter")]
        [OpenApiParameter(name: "Limit", In = ParameterLocation.Query, Required = false, Type = typeof(int), Description = "limits the records")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
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
                StartDate = !string.IsNullOrWhiteSpace(req.Query["StartDate"]) ? DateTime.Parse(req.Query["StartDate"]) : default,
                EndDate = !string.IsNullOrWhiteSpace(req.Query["EndDate"]) ? DateTime.Parse(req.Query["EndDate"]) : default,
                Offset = !string.IsNullOrWhiteSpace(req.Query["offset"]) ? Convert.ToInt32(req.Query["offset"]) : default,
                Limit = !string.IsNullOrWhiteSpace(req.Query["limit"]) ? Convert.ToInt32(req.Query["limit"]) : default
            };

            List<string> whereStatements = new List<string>();

            //Date Range
            if (submissionQuery.StartDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.dateSubmitted > '{(DateTime)submissionQuery.StartDate:o}'");
            }
            if (submissionQuery.EndDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.dateSubmitted < '{(DateTime)submissionQuery.EndDate:o}'");
            }

            //limit 
            var limit = string.Empty;
            if (submissionQuery.Limit != 0)
            {
                limit = Environment.NewLine + $"OFFSET {submissionQuery.Offset} LIMIT {submissionQuery.Limit}";
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

            var order = Environment.NewLine + "ORDER BY c.dateSubmitted DESC";

            var response = await _submissionCosmosDbService.GetSubmissionsAsync($"SELECT * FROM c {where} {order} {limit}");

            var count = await _submissionCosmosDbService.GetSubmissionsCountAsync($"SELECT VALUE Count(1) FROM c");

            return new OkObjectResult(new { submissions = response, total = count });
        }
        public class SubmissionQuery
        {
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public int Limit { get; set; }
            public int Offset { get; set; }
        }
    }
}

