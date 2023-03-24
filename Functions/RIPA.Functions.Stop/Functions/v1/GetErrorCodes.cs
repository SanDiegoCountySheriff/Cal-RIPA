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
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v1;

public class GetErrorCodes
{
    private readonly IStopCosmosDbService _stopCosmosDbService;
    public GetErrorCodes(IStopCosmosDbService stopCosmosDbService)
    {
        _stopCosmosDbService = stopCosmosDbService;
    }

    [FunctionName("GetErrorCodes_v1")]
    [OpenApiOperation(operationId: "v1/GetErrorCodes", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Search", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "Type ahead error search")]
    [OpenApiParameter(name: "SubmissionId", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "The Submission Id to filter errors by")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(List<string>), Description = "Return a list of errors, maybe object with code and message properties")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/GetErrorCodes")] HttpRequest req, ILogger log)
    {
        log.LogInformation("Get - GetErrorCodes requested.");
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

        var inputText = req.Query["Search"];
        var submissionId = req.Query["SubmissionId"];

        try
        {
            var response = await _stopCosmosDbService.GetErrorCodes(inputText, submissionId);
            return new OkObjectResult(response);
        }
        catch (Exception ex)
        {
            log.LogError($"Error getting stop error codes: {ex.Message}");
            return new BadRequestObjectResult($"Error getting stop error codes: {ex.Message}");
        }
    }
}
