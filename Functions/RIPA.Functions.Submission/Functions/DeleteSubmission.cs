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
    public class DeleteSubmission
    {
        private readonly ISubmissionCosmosDbService _submissionCosmosDbService;

        public DeleteSubmission(ISubmissionCosmosDbService submissionCosmosDbService)
        {
            _submissionCosmosDbService = submissionCosmosDbService;
        }

        [FunctionName("DeleteSubmission")]
        [OpenApiOperation(operationId: "DeleteSubmission", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Submission Id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Submission deleted")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Submission Id not found")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "deleted", Route = "DeleteSubmission/{Id}")] HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("Delete - Delete Submission requested");

            if (!string.IsNullOrEmpty(Id))
            {
                await _submissionCosmosDbService.DeleteSubmissionAsync(Id);
                return new OkObjectResult($"Deleted {Id}");
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}

