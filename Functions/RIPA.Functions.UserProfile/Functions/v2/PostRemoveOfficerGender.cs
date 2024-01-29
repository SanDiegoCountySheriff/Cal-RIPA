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

public class PostRemoveOfficerGender
{
    private readonly IUserProfileCosmosDbService<Common.Models.v2.UserProfile> _userProfileCosmosDbService;

    public PostRemoveOfficerGender(IUserProfileCosmosDbService<Common.Models.v2.UserProfile> userProfileCosmosDbService)
    {
        _userProfileCosmosDbService = userProfileCosmosDbService;
    }

    [FunctionName("PostRemoveOfficerGender_v2")]
    [OpenApiOperation(operationId: "v2/PostRemoveOfficerGender", tags: new[] { "name", "v2" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Upload Complete")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "File Format Error; Please pass form-data with key: 'file' value: filepath.csv")]

    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v2/PostRemoveOfficerGender")] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("Importing user profiles from uploaded csv");

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
            await _userProfileCosmosDbService.RemoveOfficerGender();

            return new OkResult();
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);
            return new NotFoundResult();
        }
    }
}