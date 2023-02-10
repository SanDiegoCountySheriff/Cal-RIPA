using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.Beats.Models;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Beats;

public class GetBeats
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly TableClient _tableClient;

    public GetBeats(TableServiceClient tableServiceClient)
    {
        _tableServiceClient = tableServiceClient;
        _tableClient = _tableServiceClient.GetTableClient("Beats");
    }

    [FunctionName("GetBeats")]
    [OpenApiOperation(operationId: "GetBeats", tags: new[] { "name" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Beats")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
    {
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

        List<Beat> response = new List<Beat>();

        try
        {
            var queryResults = _tableClient.Query<Beat>();

            foreach (var beat in queryResults)
            {
                response.Add(beat);
            }
        }
        catch (Exception ex)
        {
            return new NotFoundObjectResult(ex.Message);
        }

        log.LogInformation($"GetBeats returned {response.Count} beats");
        return new OkObjectResult(response);
    }
}
