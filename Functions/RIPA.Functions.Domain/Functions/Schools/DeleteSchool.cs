
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.Schools.Models;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Schools;

public class DeleteSchool
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly TableClient _tableClient;

    public DeleteSchool(TableServiceClient tableServiceClient)
    {
        _tableServiceClient = tableServiceClient;
        _tableClient = _tableServiceClient.GetTableClient("Schools");
    }

    [FunctionName("DeleteSchool")]
    [OpenApiOperation(operationId: "DeleteSchool", tags: new[] { "name" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The School Id/Name")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "School deleted")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "School Id not found")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteSchool/{Id}")] HttpRequest req, string Id, ILogger log)
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
            School school = new School { PartitionKey = "CA", RowKey = Id, Name = Id };
            var response = await _tableClient.DeleteEntityAsync(school.PartitionKey, school.RowKey);

            return new OkObjectResult(response.ToString());
        }
        catch
        {
            return new BadRequestObjectResult("School Id not found");
        }
    }
}
