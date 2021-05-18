using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Security;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.UserProfile.Functions
{
    public class PutUser
    {
        private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

        public PutUser(IUserProfileCosmosDbService userProfileCosmosDbService)
        {
            _userProfileCosmosDbService = userProfileCosmosDbService;
        }

        [FunctionName("PutUser")]

        [OpenApiOperation(operationId: "PutUser", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The User Id")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Services.CosmosDb.Models.UserProfile), Deprecated = false, Description = "User Profile object", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Services.CosmosDb.Models.UserProfile), Description = "User Profile Created")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "User Profile failed on insert or replace")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutUser/{Id}")] Services.CosmosDb.Models.UserProfile userProfile, HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("PUT - Put User requested");
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

            if (!string.IsNullOrEmpty(userProfile.FirstName))
            {
                userProfile.Id = Id;
                await _userProfileCosmosDbService.UpdateUserProfileAsync(Id, userProfile);
                return new OkObjectResult(userProfile);
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}

