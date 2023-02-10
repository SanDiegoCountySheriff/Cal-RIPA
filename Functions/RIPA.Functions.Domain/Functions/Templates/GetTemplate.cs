using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.Templates.Models;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Templates;

public class GetTemplate
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly TableClient _tableClient;

    public GetTemplate(TableServiceClient tableServiceClient)
    {
        _tableServiceClient = tableServiceClient;
        _tableClient = _tableServiceClient.GetTableClient("Templates");
    }

    [FunctionName("GetTemplate")]
    [OpenApiOperation(operationId: "GetTemplate", tags: new[] { "name" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Template Id/Name")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Template), Description = "Template Object")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Template Id not found")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetTemplate/{Id}")] HttpRequest req, string Id, ILogger log)
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

        try
        {
            Template result = await _tableClient.GetEntityAsync<Template>("CA", Id);

            return new OkObjectResult(result);
        }
        catch
        {
            return new BadRequestObjectResult("Template not found");
        }
    }
}

