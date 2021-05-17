using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Templates.Models;
using RIPA.Functions.Security;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Domain.Functions.Templates
{
    public static class GetTemplates
    {
        [FunctionName("GetTemplates")]

        [OpenApiOperation(operationId: "GetTemplates", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Template")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Templates", Connection = "RipaStorage")] CloudTable templates, ILogger log)

        {
            if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            List<Template> response = new List<Template>();
            TableContinuationToken continuationToken = null;
            do
            {
                var request = await templates.ExecuteQuerySegmentedAsync(new TableQuery<Template>(), continuationToken);
                continuationToken = request.ContinuationToken;

                foreach (Template entity in request)
                {
                    response.Add(entity);
                }
            } 
            while (continuationToken != null);
            
            log.LogInformation($"GetTemplates returned {response.Count} templates");
            return new OkObjectResult(response);
        }
    }
}

