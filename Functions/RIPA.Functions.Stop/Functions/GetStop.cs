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
    public class GetStop
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public GetStop(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("GetStop")]
        [OpenApiOperation(operationId: "GetStop", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Stop Id/ori")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Services.CosmosDb.Models.Stop), Description = "Stop Object")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Stop Id/ori not found")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetStop/{Id}")] HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("GET - Get Stop requested");

            if (!string.IsNullOrEmpty(Id))
            {
                var response = await _stopCosmosDbService.GetStopAsync(Id);
                if (response != null)
                {
                    return new OkObjectResult(response);
                }
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}

