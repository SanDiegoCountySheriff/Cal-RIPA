using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Configurations;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.UserProfile.Functions
{
    public class GetUser
    {
        private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

        public GetUser(IUserProfileCosmosDbService userProfileCosmosDbService)
        {
            _userProfileCosmosDbService = userProfileCosmosDbService;
        }

        [FunctionName("GetUser")]

        [OpenApiOperation(operationId: "GetUser", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The User Id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Common.Models.UserProfile), Description = "User Profile Object")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "User Id not found")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetUser/{Id}")] HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("GET - Get User requested");

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

            try
            {
                var response = await _userProfileCosmosDbService.GetUserProfileAsync(Id);
                return new OkObjectResult(response);
            }
            catch (CosmosException cosmosException)
            {
                log.LogError($"Cosmos exception: {cosmosException.Message}");

                if (cosmosException.StatusCode == HttpStatusCode.NotFound)
                {
                    return new NotFoundResult();
                }

                return new BadRequestObjectResult($"Unable to get user: {cosmosException.Message}");
            }
            catch (Exception ex)
            {
                log.LogError($"Unable to get user: {ex.Message}");
                return new BadRequestObjectResult($"Unable to get user: {ex.Message}");
            }
        }
    }
}

