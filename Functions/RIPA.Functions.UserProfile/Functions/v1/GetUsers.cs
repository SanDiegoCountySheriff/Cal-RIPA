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

namespace RIPA.Functions.UserProfile.Functions.v1;

public class GetUsers
{
    private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

    public GetUsers(IUserProfileCosmosDbService userProfileCosmosDbService)
    {
        _userProfileCosmosDbService = userProfileCosmosDbService;
    }

    [FunctionName("GetUsers_v1")]
    [OpenApiOperation(operationId: "v1/GetUsers", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(System.Collections.Generic.IEnumerable<Common.Models.v1.UserProfile>), Description = "List of User Profiles")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/GetUsers")] HttpRequest req, ILogger log)
    {
        log.LogInformation("GET - Get Users requested");

        try
        {
            if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
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
            var response = await _userProfileCosmosDbService.GetUserProfilesAsync("SELECT * FROM c ORDER BY c.name");
            return new OkObjectResult(response);
        }
        catch (Exception ex)
        {
            log.LogError($"Unable to get user profiles: {ex.Message}");
            return new BadRequestObjectResult($"Unable to get user profiles: {ex.Message}");
        }
    }
}
