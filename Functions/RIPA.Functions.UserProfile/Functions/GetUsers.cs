using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.UserProfile.Functions
{
    public class GetUsers
    {
        private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

        public GetUsers(IUserProfileCosmosDbService userProfileCosmosDbService)
        {
            _userProfileCosmosDbService = userProfileCosmosDbService;
        }

        [FunctionName("GetUsers")]
        [OpenApiOperation(operationId: "GetUsers", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(System.Collections.Generic.IEnumerable<Services.CosmosDb.Models.UserProfile>), Description = "List of User Profiles")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("GET - Get Users requested");

            var response = await _userProfileCosmosDbService.GetUserProfilesAsync("SELECT * FROM c ORDER BY c.name");

            return new OkObjectResult(response);
        }
    }
}

