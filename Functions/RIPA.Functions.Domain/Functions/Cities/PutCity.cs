using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Cities.Models;
using RIPA.Functions.Security;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Cities
{
    public class PutCity
    {
        [FunctionName("PutCity")]


        [OpenApiOperation(operationId: "PutCity", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The City Id/Name")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(City), Deprecated = false, Description = "City object", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "City Created")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "City failed on insert or replace")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutCity/{Id}")] City city, HttpRequest req,string Id,
            [Table("Cities", Connection = "RipaStorage")] CloudTable cities, ILogger log)
        {
            if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            try
            {
                city.PartitionKey = "CA";
                city.RowKey = Id;
                city.Name = Id;
                city.ETag = "*";
                city.State = "CA";
                TableOperation createOperation = TableOperation.InsertOrReplace(city);
                TableResult result = await cities.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("City failed on insert or replace");
            }
        }
    }
}
