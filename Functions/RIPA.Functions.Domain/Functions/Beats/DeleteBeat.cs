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
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Beats;

public class DeleteBeat
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly TableClient _tableClient;

    public DeleteBeat(TableServiceClient tableServiceClient)
    {
        _tableServiceClient = tableServiceClient;
        _tableClient = _tableServiceClient.GetTableClient("Beats");
    }

    [FunctionName("DeleteBeat")]
    [OpenApiOperation(operationId: "DeleteBeat", tags: new[] { "name" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Beat Id")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Beat deleted")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Beat Id not found")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteBeat/{Id}")] HttpRequest req, int Id, ILogger log)
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
            Beat beat = new Beat { PartitionKey = "CA", RowKey = Id.ToString(), Id = Id };
            var response = await _tableClient.DeleteEntityAsync(beat.PartitionKey, beat.RowKey);

            return new OkObjectResult(response.ToString());
        }
        catch
        {
            return new BadRequestObjectResult("Beat Id not found");
        }
    }
}

