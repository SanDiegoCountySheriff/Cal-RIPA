﻿using Azure;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.v1.Cities.Models;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.v1.Cities;

public class DeleteCity
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly TableClient _tableClient;

    public DeleteCity(TableServiceClient tableServiceClient)
    {
        _tableServiceClient = tableServiceClient;
        _tableClient = _tableServiceClient.GetTableClient("Cities");
    }

    [FunctionName("DeleteCity_v1")]
    [OpenApiOperation(operationId: "v1/DeleteCity", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The City Id/Name")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "City deleted")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "City Id not found")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "v1/DeleteCity/{Id}")] HttpRequest req, string Id, ILogger log)
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
            City city = new City() { PartitionKey = "CA", RowKey = Id, Name = Id };
            Response response = await _tableClient.DeleteEntityAsync(city.PartitionKey, city.RowKey);

            return new OkObjectResult(response.ToString());
        }
        catch
        {
            return new BadRequestObjectResult("City Id not found");
        }
    }
}
