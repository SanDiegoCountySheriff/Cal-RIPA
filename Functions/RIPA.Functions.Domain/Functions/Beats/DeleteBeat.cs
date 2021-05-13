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
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Beats
{
    public static class DeleteBeat
    {
        [FunctionName("DeleteBeat")]

        [OpenApiOperation(operationId: "DeleteBeat", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Beat Id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Beat deleted")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Beat Id not found")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteBeat/{Id}")] HttpRequest req, int Id,
            [Table("Beats", Connection = "RipaStorage")] CloudTable beats, ILogger log)
        {
            if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            try
            {
                Beat beat = new Beat { PartitionKey = "CA", RowKey = Id.ToString(), Id = Id, ETag = "*" };
                TableOperation deleteOperation = TableOperation.Delete(beat);
                TableResult result = await beats.ExecuteAsync(deleteOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Beat Id not found");
            }
        }
    }
}

