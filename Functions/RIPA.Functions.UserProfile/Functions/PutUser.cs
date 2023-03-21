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
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.UserProfile.Functions;

public class PutUser
{
    private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

    public PutUser(IUserProfileCosmosDbService userProfileCosmosDbService)
    {
        _userProfileCosmosDbService = userProfileCosmosDbService;
    }

    [FunctionName("PutUser")]

    [OpenApiOperation(operationId: "PutUser", tags: new[] { "name" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The User Id")]
    [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Common.Models.v1.UserProfile), Deprecated = false, Description = "User Profile object", Required = true)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Common.Models.v1.UserProfile), Description = "User Profile Created")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "User Profile failed on insert or replace")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutUser/{Id}")] Common.Models.v1.UserProfile userProfile, HttpRequest req, string Id, ILogger log)
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

        if (!string.IsNullOrEmpty(userProfile.OfficerId) && userProfile.OfficerId.Length != 9)
        {
            return new BadRequestObjectResult("OfficerId must be 9 chars");
        }

        if (string.IsNullOrEmpty(userProfile.OfficerId))
        {
            int officerId = 100000000;

            string query = "SELECT VALUE c FROM c ORDER BY c.officerId DESC OFFSET 0 LIMIT 1";
            IEnumerable<Common.Models.v1.UserProfile> maxOfficer = await _userProfileCosmosDbService.GetUserProfilesAsync(query);

            Common.Models.v1.UserProfile maxId = maxOfficer.FirstOrDefault();
            if (maxId != null)
            {
                officerId = int.Parse(maxId.OfficerId);
                officerId++;
            }

            userProfile.OfficerId = officerId.ToString();
        }

        userProfile.Id = Id;

        try
        {
            await _userProfileCosmosDbService.UpdateUserProfileAsync(Id, userProfile);
            return new OkObjectResult(userProfile);
        }
        catch (Exception ex)
        {
            log.LogError($"Error updating user profile: {ex.Message}");
            return new BadRequestObjectResult($"Error updating user profile: {ex.Message}");
        }
    }
}
