using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Security;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;
using System;
using System.Collections.Generic;
using System.Globalization;
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
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "IsSubmitted", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Return Submitted OR UnSubmitted stops, defaults to false")]
        [OpenApiParameter(name: "IsError", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns Submitted Stops that have errors, IsSubmitted must be true or this will be ignored")]
        [OpenApiParameter(name: "SubmissionId", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns Submitted Stops where submission id equals input submission id, is submitted mus be true or this will be ignored")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(System.Collections.Generic.IEnumerable<Common.Models.Stop>), Description = "List of Stops")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("GET - Get Stops requested");

            if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            //Get the query
            StopQuery stopQuery = new StopQuery
            {
                StartDate = !string.IsNullOrWhiteSpace(req.Query["StartDate"]) ? DateTime.Parse(req.Query["StartDate"]) : default,
                EndDate = !string.IsNullOrWhiteSpace(req.Query["EndDate"]) ? DateTime.Parse(req.Query["EndDate"]) : default,
                IsError = !string.IsNullOrWhiteSpace(req.Query["IsError"]) ? bool.Parse(req.Query["IsError"]) : false,
                IsSubmitted = !string.IsNullOrWhiteSpace(req.Query["IsSubmitted"]) ? bool.Parse(req.Query["IsSubmitted"]) : false,
                SubmissionId = !string.IsNullOrWhiteSpace(req.Query["SubmissionId"]) ? req.Query["SubmissionId"] : default
            };

            List<string> whereStatements = new List<string>();
            string join = "";

            //Date Range
            if (stopQuery.StartDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.StopDateTime > '{(DateTime)stopQuery.StartDate:o}'");
            }
            if (stopQuery.EndDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.StopDateTime < '{(DateTime)stopQuery.EndDate:o}'");
            }

            //IsSubmitted
            if (stopQuery.IsSubmitted)
            {
                //IsError
                if (stopQuery.IsError)
                {
                    whereStatements.Add(Environment.NewLine + $"c.Status = '{Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)}'");
                }
                else
                {
                    whereStatements.Add(Environment.NewLine + $"c.Status != '{Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)}'");
                }
                //SubmssionId
                if (!String.IsNullOrWhiteSpace(stopQuery.SubmissionId))
                {
                    join = Environment.NewLine + "JOIN Submission IN c.ListSubmission";
                    whereStatements.Add(Environment.NewLine + $"Submission.Id = '{stopQuery.SubmissionId}'");
                }

            }
            else
            {
                whereStatements.Add(Environment.NewLine + $"c.Status = null");
            }



            string where = " WHERE ";
            foreach (var whereStatement in whereStatements)
            {
                where += Environment.NewLine + whereStatement;
                where += Environment.NewLine + "AND";
            }
            where = where.Remove(where.Length - 3);

            var response = await _stopCosmosDbService.GetStopsAsync("SELECT VALUE c FROM c" + join + where);

            return new OkObjectResult(response);
        }

        public class StopQuery
        {
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public bool IsError { get; set; }
            public bool IsSubmitted { get; set; }
            public string SubmissionId { get; set; }

        }
    }
}

