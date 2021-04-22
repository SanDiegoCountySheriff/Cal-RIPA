using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Beats.Models;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Beats
{
    public static class PutBeat
    {
        [FunctionName("PutBeat")]

        [OpenApiOperation(operationId: "PutBeat", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Beat Id")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Beat), Deprecated = false, Description = "beat object", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Beat Created")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Beat failed on insert or replace")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutBeat/{Id}")] Beat beat, int Id,
            [Table("Beats", Connection = "RipaStorage")] CloudTable beats, ILogger log)

        {
            try
            {
                beat.PartitionKey = "CA";
                beat.RowKey = Id.ToString();
                beat.Id = Id;
                beat.ETag = "*";
                TableOperation createOperation = TableOperation.InsertOrReplace(beat);
                TableResult result = await beats.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("beat failed on insert or replace");
            }
        }
    }
}

