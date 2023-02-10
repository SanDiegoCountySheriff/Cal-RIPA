using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.Cities.Models;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Cities;

public class GetCities
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly TableClient _tableClient;

    public GetCities(TableServiceClient tableServiceClient)
    {
        _tableServiceClient = tableServiceClient;
        _tableClient = _tableServiceClient.GetTableClient("Cities");
    }

    [FunctionName("GetCities")]
    [OpenApiOperation(operationId: "GetCities", tags: new[] { "name" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Cities")]
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

        List<City> response = new List<City>();

        var singleResponse = _tableClient.Query<City>().FirstOrDefault();
        var etag = singleResponse.ETag;
        req.HttpContext.Response.Headers.Add("ETag", etag.ToString());

        if (etag == req.Headers["If-None-Match"])
        {
            return new StatusCodeResult((int)HttpStatusCode.NotModified);
        }

        try
        {
            var queryResults = _tableClient.Query<City>();

            foreach (var city in queryResults)
            {
                response.Add(city);
            }
        }
        catch (Exception ex)
        {
            return new NotFoundObjectResult(ex.Message);
        }

        log.LogInformation($"GetCities returned {response.Count} cities");
        return new OkObjectResult(response);
    }
}
