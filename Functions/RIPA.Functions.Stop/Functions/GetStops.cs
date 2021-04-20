using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;
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
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(System.Collections.Generic.IEnumerable<Services.CosmosDb.Models.Stop>), Description = "List of Stops")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("GET - Get Stops requested");

            var response = await _stopCosmosDbService.GetStopsAsync("SELECT * FROM c");

            return new OkObjectResult(response);
        }
    }
}

