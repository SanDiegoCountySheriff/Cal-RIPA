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
    public class DeleteStop
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public DeleteStop(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("DeleteStop")]
        [OpenApiOperation(operationId: "DeleteStop", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Stop Id/ori")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Stop deleted")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Stop Id not found")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteStop/{Id}")] HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("Delete - Delete Stop requested");

            if (!string.IsNullOrEmpty(Id))
            {
                await _stopCosmosDbService.DeleteStopAsync(Id);
                return new OkObjectResult($"Deleted {Id}");
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}

