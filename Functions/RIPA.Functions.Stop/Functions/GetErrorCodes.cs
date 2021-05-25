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
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;

namespace RIPA.Functions.Stop.Functions
{
    public class GetErrorCodes
    {
        private IStopCosmosDbService _stopCosmosDbService;
        public GetErrorCodes(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("GetErrorCodes")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Search", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "Type ahead error search")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(List<string>), Description = "Return a list of errors, maybe object with code and message properties")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("Get - GetErrorCodes requested.");

            var inputText = req.Query["Search"];
            var response = await _stopCosmosDbService.GetErrorCodes(inputText);
            
            return new OkObjectResult(response);
        }
    }
}

