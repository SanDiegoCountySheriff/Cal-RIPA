using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.Azure.Cosmos.Table;
using RIPA.Functions.Domain.Functions.Templates.Models;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Domain.Functions.Templates
{
    public static class PutTemplate
    {
        [FunctionName("PutTemplate")]

        [OpenApiOperation(operationId: "PutTemplate", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Template Id/Name")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Template), Deprecated = false, Description = "Template object", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Template Created")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Template failed on insert or replace")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutTemplate/{Id}")] Template template, HttpRequest req, string Id,
            [Table("Templates", Connection = "RipaStorage")] CloudTable templates, ILogger log)
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
                if (String.IsNullOrEmpty(Id))
                {
                    throw new Exception("template id is required");
                }
                template.PartitionKey = "CA";
                template.RowKey = Id;
                template.ETag = "*";
                TableOperation createOperation = TableOperation.InsertOrReplace(template);
                TableResult result = await templates.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Template failed on insert or replace");
            }
        }
    }
}

