using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;
using System.Threading.Tasks;

namespace RIPA.Functions.UserProfile.Functions
{
    public class DeleteUser
    {
        private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

        public DeleteUser(IUserProfileCosmosDbService userProfileCosmosDbService)
        {
            _userProfileCosmosDbService = userProfileCosmosDbService;
        }

        [FunctionName("DeleteUser")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteUser/{Id}")] HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("Delete - Delete User requested");

            if (!string.IsNullOrEmpty(Id))
            {
                await _userProfileCosmosDbService.DeleteUserProfileAsync(Id);
                return new OkObjectResult($"Deleted {Id}");
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}

