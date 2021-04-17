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
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Domain.Functions.Statutes
{
    public class DeleteStatute
    {
        [FunctionName("DeleteStatute")]

        [OpenApiOperation(operationId: "DeleteStatute", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The Statute Id/Name")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Statute deleted")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Statute Id not found")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteStatute/{Id}")] HttpRequest req, int Id,
            [Table("Statutes", Connection = "RipaStorage")] CloudTable statutes, ILogger log)
        {
            try
            {
                Statute statute = new Statute { PartitionKey = "CA", RowKey = Id.ToString(), OffenseCode = Id, ETag = "*" };
                TableOperation deleteOperation = TableOperation.Delete(statute);
                TableResult result = await statutes.ExecuteAsync(deleteOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Statute Offense Code not found");
            }
        }
    }
}

