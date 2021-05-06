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
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;

namespace RIPA.Functions.Submission.Functions
{
    public class GetSubmission
    {
        private readonly ISubmissionCosmosDbService _submissionCosmosDbService;

        public GetSubmission(ISubmissionCosmosDbService submissionCosmosDbService)
        {
            _submissionCosmosDbService = submissionCosmosDbService;
        }

        [FunctionName("GetSubmission")]
        [OpenApiOperation(operationId: "GetSubmission", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Submission Id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Models.Submission), Description = "Subission Object")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Submission Id not found")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetSubmission/{Id}")] HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("GET - Get Submission requested");

            if (!string.IsNullOrEmpty(Id))
            {
                var response = await _submissionCosmosDbService.GetSSubmissionAsync(Id);
                if (response != null)
                {
                    return new OkObjectResult(response);
                }
            }

            return new BadRequestObjectResult("Submission Id not found");
        }
    }
}

