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
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Templates
{
    public static class DeleteTemplate
    {
        [FunctionName("DeleteTemplate")]

        [OpenApiOperation(operationId: "DeleteTemplate", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Template Id/Name")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Template deleted")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Template Id not found")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteTemplate/{Id}")] HttpRequest req, string Id,
            [Table("Templates", Connection = "RipaStorage")] CloudTable templates, ILogger log)
        {
            try
            {
                Template template = new Template { PartitionKey = "CA", RowKey = Id, ETag = "*" };
                TableOperation deleteOperation = TableOperation.Delete(template);
                TableResult result = await templates.ExecuteAsync(deleteOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Template not found");
            }
        }
    }
}

