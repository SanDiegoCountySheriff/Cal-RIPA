using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;
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
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutUser/{Id}")] Services.CosmosDb.Models.UserProfile userProfile, string Id, ILogger log)
        {
            log.LogInformation("PUT - Put User requested");

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

