using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.v1.Templates.Models;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.v1.Templates;

public class DeleteTemplate
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly TableClient _tableClient;

    public DeleteTemplate(TableServiceClient tableServiceClient)
    {
        _tableServiceClient = tableServiceClient;
        _tableClient = _tableServiceClient.GetTableClient("Templates");
    }

    [FunctionName("DeleteTemplate_v1")]
    [OpenApiOperation(operationId: "v1/DeleteTemplate", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Template Id/Name")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Template deleted")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Template Id not found")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "v1/DeleteTemplate/{Id}")] HttpRequest req, string Id, ILogger log)
    {
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
            Template template = new Template { PartitionKey = "CA", RowKey = Id };

            var response = await _tableClient.DeleteEntityAsync(template.PartitionKey, template.RowKey);

            return new OkObjectResult(response.ToString());
        }
        catch
        {
            return new BadRequestObjectResult("Template not found");
        }
    }
}
