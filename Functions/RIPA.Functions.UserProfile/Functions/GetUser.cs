using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;
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
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetUser/{userProfileId}")] HttpRequest req, string userProfileId, ILogger log)
        {
            log.LogInformation("GET - Get User requested");

            if (!string.IsNullOrEmpty(userProfileId))
            {
                var response = await _userProfileCosmosDbService.GetUserProfileAsync(userProfileId);
                if (response != null)
                {
                    return new OkObjectResult(response);
                }
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}

