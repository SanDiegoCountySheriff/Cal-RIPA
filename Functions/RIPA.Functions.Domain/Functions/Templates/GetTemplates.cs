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
            List<Template> response = new List<Template>();

            foreach (Template entity in await templates.ExecuteQuerySegmentedAsync(new TableQuery<Template>(), null))
            {
                response.Add(entity);
            }

            return new OkObjectResult(response);
        }
    }
}

