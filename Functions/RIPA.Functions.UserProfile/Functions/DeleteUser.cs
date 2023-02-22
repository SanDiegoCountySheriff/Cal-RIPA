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


namespace RIPA.Functions.UserProfile.Functions;

public class DeleteUser
{
    private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

    public DeleteUser(IUserProfileCosmosDbService userProfileCosmosDbService)
    {
        _userProfileCosmosDbService = userProfileCosmosDbService;
    }

    [OpenApiOperation(operationId: "DeleteUser", tags: new[] { "name" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The User Id")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "User deleted")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "User Id not found")]

    [FunctionName("DeleteUser")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteUser/{Id}")] HttpRequest req, string Id, ILogger log)
    {
        log.LogInformation("Delete - Delete User requested");

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

        if (!string.IsNullOrEmpty(Id))
        {
            try
            {
                await _userProfileCosmosDbService.DeleteUserProfileAsync(Id);
                return new OkObjectResult($"Deleted {Id}");
            }
            catch (Exception ex)
            {
                log.LogError($"Unable to delete user profile: {ex.Message}");
                return new BadRequestObjectResult($"Unable to delete user profile: {ex.Message}");
            }
        }

        return new BadRequestObjectResult("ID Not Provided");
    }
}
