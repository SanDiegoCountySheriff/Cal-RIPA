using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Security;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;
using System;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Stop.Functions
{
    public class PutStop
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public PutStop(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("PutStop")]
        [OpenApiOperation(operationId: "PutStop", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Stop Id/ori")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Common.Models.Stop), Deprecated = false, Description = "Stop object", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Common.Models.Stop), Description = "Stop Created")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Stop failed on insert or replace")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutStop/{Id}")] Common.Models.Stop stop, HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("PUT - Put Stop requested");

            if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            if (!string.IsNullOrEmpty(Id))
            {
                stop.id = Id;
                if (stop.OfficerID.Length != 9)
                {
                    return new BadRequestObjectResult("Office ID must be 9 char");
                }
                stop.Ori = Environment.GetEnvironmentVariable("ORI"); //What is an Originating Agency Identification (ORI) Number? A nine-character identifier assigned to an agency. Agencies must identify their ORI Number...
                await _stopCosmosDbService.UpdateStopAsync(Id, stop);
                return new OkObjectResult(stop);
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}

