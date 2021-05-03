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
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Domain.Functions.Schools
{
    public class GetSchools
    {
        [FunctionName("GetSchools")]

        [OpenApiOperation(operationId: "GetSchools", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Schools")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Schools", Connection = "RipaStorage")] CloudTable schools, ILogger log)
        {
            List<School> response = new List<School>();
            TableContinuationToken continuationToken = null;
            do
            {
                var request = await schools.ExecuteQuerySegmentedAsync(new TableQuery<School>(), continuationToken);
                continuationToken = request.ContinuationToken;
                
                foreach (School entity in request)
                {
                    response.Add(entity);
                }
            } 
            while (continuationToken != null);

            log.LogInformation($"GetSchools returned {response.Count} schools");
            return new OkObjectResult(response);
        }
    }
}
