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
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v2;

public class GetStop
{
    private readonly IStopCosmosDbService _stopCosmosDbService;

    public GetStop(IStopCosmosDbService stopCosmosDbService)
    {
        _stopCosmosDbService = stopCosmosDbService;
    }

    [FunctionName("GetStop_v2")]
    [OpenApiOperation(operationId: "v2/GetStop", tags: new[] { "name", "v2" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Stop Id/ori")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Common.Models.v2.Stop), Description = "Stop Object")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Stop Id/ori not found")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v2/GetStop/{Id}")] HttpRequest req, string Id, ILogger log)
    {
        log.LogInformation("GET - Get Stop requested");

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

        try
        {
            var response = await _stopCosmosDbService.GetStopAsync(Id);
            return new OkObjectResult(response);
        }
        catch (Exception ex)
        {
            log.LogError($"Error getting stop: {ex.Message}");
            return new BadRequestObjectResult($"Error getting stop: {ex.Message}");
        }
    }
}
