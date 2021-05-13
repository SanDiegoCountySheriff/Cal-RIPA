using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Schools.Models;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Schools
{
    public class PutSchool
    {
        [FunctionName("PutSchool")]

        [OpenApiOperation(operationId: "PutSchool", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The School Id/Name")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(School), Deprecated = false, Description = "School object", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "School Created")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "School failed on insert or replace")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutSchool/{Id}")] HttpRequest req, School school, string Id,
            [Table("Schools", Connection = "RipaStorage")] CloudTable schools, ILogger log)
        {
            if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            try
            {
                if (school.CDSCode == 0)
                {
                    throw new Exception("CDS CODE Must be Integer and is required");
                }
                school.PartitionKey = "CA";
                school.RowKey = Id;
                school.Name = Id;
                school.ETag = "*";
                TableOperation createOperation = TableOperation.InsertOrReplace(school);
                TableResult result = await schools.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("School failed on insert or replace");
            }
        }
    }
}
