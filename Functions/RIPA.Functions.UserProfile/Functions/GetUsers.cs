using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;

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
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)]HttpRequest req, ILogger log)
        {
            log.LogInformation("GET - Get Users requested");

            var response = await _userProfileCosmosDbService.GetUserProfilesAsync("SELECT * FROM c ORDER BY c.name");

            return new OkObjectResult(response);
        }
    }
}

