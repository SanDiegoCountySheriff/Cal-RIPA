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
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(System.Collections.Generic.IEnumerable<Models.Submission>), Description = "List of Submissions")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("GET - Get Submissions requested");

            if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            var response = await _submissionCosmosDbService.GetSubmissionsAsync("SELECT * FROM c ORDER BY c.dateSubmitted");

            return new OkObjectResult(response);
        }
    }
}

