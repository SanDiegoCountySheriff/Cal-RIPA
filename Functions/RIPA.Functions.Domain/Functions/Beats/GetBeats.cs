using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Beats.Models;
using RIPA.Functions.Security;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Beats
{
    public static class GetBeats
    {
        [FunctionName("GetBeats")]

        [OpenApiOperation(operationId: "GetBeats", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Beats")]

        public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
        [Table("Beats", Connection = "RipaStorage")] CloudTable beats, ILogger log)
        {
            if(!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            List<Beat> response = new List<Beat>();
            TableContinuationToken continuationToken = null;
            do
            {
                var request = await beats.ExecuteQuerySegmentedAsync(new TableQuery<Beat>(), continuationToken);
                continuationToken = request.ContinuationToken;

                foreach (Beat entity in request)
                {
                    response.Add(entity);
                }
            } 
            while (continuationToken != null);

            log.LogInformation($"GetBeats returned {response.Count} beats");
            return new OkObjectResult(response);
        }
    }
}
