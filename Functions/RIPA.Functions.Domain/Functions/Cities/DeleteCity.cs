
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.Azure.Cosmos.Table;
using RIPA.Functions.Domain.Functions.Cities.Models;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Domain.Functions.Cities
{
    public class DeleteCity
    {
        [FunctionName("DeleteCity")]

        [OpenApiOperation(operationId: "DeleteCity", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The City Id/Name")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "City deleted")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "City Id not found")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteCity/{Id}")] HttpRequest req, string Id,
            [Table("Cities", Connection = "RipaStorage")] CloudTable cities, ILogger log)
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
                City city = new City { PartitionKey = "CA", RowKey = Id, Name = Id, ETag = "*" };
                TableOperation deleteOperation = TableOperation.Delete(city);
                TableResult result = await cities.ExecuteAsync(deleteOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("City Id not found");
            }

        }
    }
}
