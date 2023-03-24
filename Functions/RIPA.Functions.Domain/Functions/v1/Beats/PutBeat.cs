using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.v1.Beats.Models;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.v1.Beats;

public class PutBeat
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly TableClient _tableClient;

    public PutBeat(TableServiceClient tableServiceClient)
    {
        _tableServiceClient = tableServiceClient;
        _tableClient = _tableServiceClient.GetTableClient("Beats");
    }

    [FunctionName("PutBeat_v1")]
    [OpenApiOperation(operationId: "v1/PutBeat", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Beat Id")]
    [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Beat), Deprecated = false, Description = "beat object", Required = true)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Beat Created")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Beat failed on insert or replace")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "v1/PutBeat/{Id}")] Beat beat, HttpRequest req, int Id, ILogger log)
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
            beat.PartitionKey = "CA";
            beat.RowKey = Id.ToString();
            beat.Id = Id;

            var response = _tableClient.UpsertEntity(beat);

            return new OkObjectResult(response.ToString());
        }
        catch
        {
            return new BadRequestObjectResult("beat failed on insert or replace");
        }
    }
}

