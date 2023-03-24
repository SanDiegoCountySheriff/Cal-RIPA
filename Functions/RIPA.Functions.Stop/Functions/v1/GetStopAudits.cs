using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Security;
using RIPA.Functions.Stop.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v1;

public class GetStopAudits
{
    private readonly IStopAuditCosmosDbService _stopAuditCosmosDbService;

    public GetStopAudits(IStopAuditCosmosDbService stopAuditCosmosDbService)
    {
        _stopAuditCosmosDbService = stopAuditCosmosDbService;
    }

    [FunctionName("v1/GetStopAudits")]
    [OpenApiOperation(operationId: "v1/GetStopAudits", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "id", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "The id of the stop")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(IEnumerable<Common.Models.v1.Stop>), Description = "List of Stops")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/GetStopAudits")] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("GET - Get stop audits requested");

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

        string id = req.Query["id"];
        string queryString = $"SELECT * FROM c WHERE Substring(c.id, 0, 12) = \"{id}\"";
        IEnumerable<IStop> stopResponse;

        try
        {
            stopResponse = await _stopAuditCosmosDbService.GetStopAuditsAsync(queryString);
            return new OkObjectResult(stopResponse);
        }
        catch (Exception ex)
        {
            log.LogError($"An error occurred getting stop audits requested: {ex.Message}");
            return new BadRequestObjectResult("An error occurred getting stop audits requested. Please try again.");
        }
    }
}
