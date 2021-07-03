using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using RIPA.Functions.Domain.Functions.Templates.Models;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Domain.Functions.Templates
{
    public static class GetTemplates
    {
        [FunctionName("GetTemplates")]

        [OpenApiOperation(operationId: "GetTemplates", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of Template")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Templates", Connection = "RipaStorage")] CloudTable templates, ILogger log)

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

            List<object> response = new List<object>();
            TableContinuationToken continuationToken = null;
            do
            {
                var request = await templates.ExecuteQuerySegmentedAsync(new TableQuery<Template>(), continuationToken);
                continuationToken = request.ContinuationToken;

                foreach (Template entity in request)
                {
                    if(entity?.DeactivationDate <= DateTime.Now)
                    {
                        continue;
                    }

                    response.Add(new
                    {
                        id = entity.Id,
                        displayName = entity.DisplayName,
                        deactivationDate = entity.DeactivationDate,
                        stop = JsonConvert.DeserializeObject(entity.StopTemplate)
                    });
                }
            }
            while (continuationToken != null);

            log.LogInformation($"GetTemplates returned {response.Count} templates");
            return new OkObjectResult(response);
        }
    }
}

