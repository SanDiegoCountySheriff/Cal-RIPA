using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.UserProfile.Functions.v2;

public class GetUser
{
    private readonly IUserProfileCosmosDbService<Common.Models.v2.UserProfile> _userProfileCosmosDbService;

    public GetUser(IUserProfileCosmosDbService<Common.Models.v2.UserProfile> userProfileCosmosDbService)
    {
        _userProfileCosmosDbService = userProfileCosmosDbService;
    }

    [FunctionName("GetUser_v2")]
    [OpenApiOperation(operationId: "v2/GetUser", tags: new[] { "name", "v2" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The User Id")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Common.Models.v2.UserProfile), Description = "User Profile Object")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "User Id not found")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v2/GetUser/{Id}")] HttpRequest req, string Id, ILogger log)
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

            if (response is null)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(response);
        }
        catch (Exception ex)
        {
            log.LogError($"Unable to get user: {ex.Message}");
            return new BadRequestObjectResult($"Unable to get user: {ex.Message}");
        }
    }
}
