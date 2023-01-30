using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.Schools.Models;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Schools
{
    public class GetSchools
    {
        [FunctionName("GetSchools")]

        [OpenApiOperation(operationId: "GetSchools", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Schools")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Schools", Connection = "RipaStorage")] CloudTable schools, ILogger log)
        {
            try
            {
                if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
                {
                    return new UnauthorizedResult();
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new UnauthorizedResult();
            }

            List<School> response = new List<School>();
            TableContinuationToken continuationToken = null;

            var singleResponse = schools.ExecuteQuery(new TableQuery<School>()).FirstOrDefault();
            var etag = singleResponse.ETag;
            req.HttpContext.Response.Headers.Add("ETag", etag);

            if (etag == req.Headers["If-None-Match"])
            {
                return new StatusCodeResult((int)HttpStatusCode.NotModified);
            }

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
