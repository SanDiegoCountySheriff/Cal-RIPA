using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb
{
    public class UserProfileCosmosDbService : IUserProfileCosmosDbService
    {
        private readonly ILogger<UserProfileCosmosDbService> _logger;
        private readonly Container _container;

        public UserProfileCosmosDbService(ILogger<UserProfileCosmosDbService> logger)
        {
            _logger = logger;
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("ContainerName");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            CosmosClientOptions clientOptions = new CosmosClientOptions();
#if DEBUG
            clientOptions.ConnectionMode = ConnectionMode.Gateway;
#endif
            CosmosClient client = new CosmosClient(account, key, clientOptions);
            _container = client.GetContainer(databaseName, containerName);
        }

        public async Task AddUserProfileAsync(Models.UserProfile userProfile)
        {
            _logger.LogInformation($"Adding user profile: {userProfile.OfficerId}");
            await _container.CreateItemAsync<Models.UserProfile>(userProfile, new PartitionKey(userProfile.Id));
        }

        public async Task DeleteUserProfileAsync(string id)
        {
            _logger.LogInformation($"Deleting user profile: {id}");
            await _container.DeleteItemAsync<Models.UserProfile>(id, new PartitionKey(id));
        }

        public async Task<Models.UserProfile> GetUserProfileAsync(string id)
        {
            ItemResponse<Models.UserProfile> response = await _container.ReadItemAsync<Models.UserProfile>(id, new PartitionKey(id));
            return response.Resource;
        }

        public async Task<IEnumerable<Models.UserProfile>> GetUserProfilesAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<Models.UserProfile>(new QueryDefinition(queryString));
            List<Models.UserProfile> results = new List<Models.UserProfile>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }
            return results;
        }

        public async Task UpdateUserProfileAsync(string id, Models.UserProfile userProfile)
        {
            await _container.UpsertItemAsync<Models.UserProfile>(userProfile, new PartitionKey(id));
        }
    }
}
