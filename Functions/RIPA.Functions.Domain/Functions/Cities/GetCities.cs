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
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Cities
{
    public class GetCities
    {
        [FunctionName("GetCities")]

        [OpenApiOperation(operationId: "GetCities", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Cities")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Cities", Connection = "RipaStorage")] CloudTable cities, ILogger log)
        {
            if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            List<City> response = new List<City>();
            TableContinuationToken continuationToken = null;
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
