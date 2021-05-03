using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Statutes.Models;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Domain.Functions.Statutes
{
    public static class GetStatutes
    {
        [FunctionName("GetStatutes")]

        [OpenApiOperation(operationId: "GetStatute", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Statute")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Statutes", Connection = "RipaStorage")] CloudTable statutes, ILogger log)
        {
            List<Statute> response = new List<Statute>();
            TableContinuationToken continuationToken = null;
            do
            {
                var request = await statutes.ExecuteQuerySegmentedAsync(new TableQuery<Statute>(), continuationToken);
                continuationToken = request.ContinuationToken;
                foreach (Statute entity in request)
                {
                    response.Add(entity);
                }
            }
            while (continuationToken != null);

            log.LogInformation($"GetStatutes returned {response.Count} statutes");
            return new OkObjectResult(response);
        }
    }
}

