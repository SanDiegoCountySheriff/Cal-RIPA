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
    public class PutUser
    {
        private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

        public PutUser(IUserProfileCosmosDbService userProfileCosmosDbService)
        {
            _userProfileCosmosDbService = userProfileCosmosDbService;
        }

        [FunctionName("PutUser")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutUser/{userProfileId}")] Services.CosmosDb.Models.UserProfile userProfile, string userProfileId, ILogger log)
        {
            log.LogInformation("POST - Create User requested");
            
            if (!string.IsNullOrEmpty(userProfile.FirstName))
            {
                userProfile.Id = userProfileId;
                await _userProfileCosmosDbService.UpdateUserProfileAsync(userProfileId, userProfile);
                return new OkObjectResult("Created UserProfile");
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}

