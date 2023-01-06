using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;
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

namespace RIPA.Functions.Domain.Functions.Cities
{
    public class GetCities
    {
        [FunctionName("GetCities")]

        [OpenApiOperation(operationId: "GetCities", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Cities")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Cities", Connection = "RipaStorage")] CloudTable cities, ILogger log)
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
            TableContinuationToken continuationToken = null;

            var singleResponse = cities.ExecuteQuery(new TableQuery<City>()).FirstOrDefault();
            var etag = singleResponse.ETag;
            req.HttpContext.Response.Headers.Add("ETag", etag);

            if (etag == req.Headers["If-None-Match"])
            {
                return new StatusCodeResult((int)HttpStatusCode.NotModified);
            }

            do
            {
                var request = await cities.ExecuteQuerySegmentedAsync(new TableQuery<City>(), continuationToken);
                continuationToken = request.ContinuationToken;

                foreach (City entity in request)
                {
                    response.Add(entity);
                }
            }
            while (continuationToken != null);

            log.LogInformation($"GetCities returned {response.Count} cities");
            return new OkObjectResult(response);

        }
    }
}
