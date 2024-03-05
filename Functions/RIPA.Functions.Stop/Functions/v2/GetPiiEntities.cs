using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v2;

public class GetPiiEntities
{
    private readonly IStopCosmosDbService<Common.Models.v2.Stop> _stopCosmosDbService;

    public GetPiiEntities(IStopCosmosDbService<Common.Models.v2.Stop> stopCosmosDbService)
    {
        _stopCosmosDbService = stopCosmosDbService;
    }

    [FunctionName("GetPiiEntities_v2")]
    [OpenApiOperation(operationId: "v2/GetPiiEntities", tags: new[] { "name", "v2" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(PiiEntitiesResponse), Description = "List of Pii Entities")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v2/GetPiiEntities")] HttpRequest req, ILogger log)
    {
        log.LogInformation("GET - Get Pii Entities requested");

        try
        {
            if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);
            return new UnauthorizedResult();
        }

        List<PiiEntitiesResponse> piiEntitiesResponse = new();

        try
        {
            piiEntitiesResponse.AddRange(await _stopCosmosDbService.GetPiiEntitiesResponseAsync(2));
        }
        catch (Exception ex)
        {
            log.LogError(ex, "An error occurred getting pii entities requested.");
            return new BadRequestObjectResult("An error occurred getting pii entities requested. Please try again.");
        }

        return new OkObjectResult(piiEntitiesResponse);
    }
}
