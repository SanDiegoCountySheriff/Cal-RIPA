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
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Domain.Functions.Statutes
{
    public static class PutStatute
    {
        [FunctionName("PutStatute")]

        [OpenApiOperation(operationId: "PutStatute", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Statute Id/Name")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Statute), Deprecated = false, Description = "Statute object", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Statute Created")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Statute failed on insert or replace")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutStatute/{Id}")] Statute statute, HttpRequest req, int Id,
             [Table("Statutes", Connection = "RipaStorage")] CloudTable statutes, ILogger log)
        {
            if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            try
            {
                if (statute.OffenseCode == 0)
                {
                    throw new Exception("Offense Code Must be type Integer and is required");
                }
                statute.PartitionKey = "CA";
                statute.RowKey = Id.ToString();
                statute.OffenseCode = Id;
                statute.ETag = "*";
                TableOperation createOperation = TableOperation.InsertOrReplace(statute);
                TableResult result = await statutes.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Statute failed on insert or replace");
            }
        }
    }
}

