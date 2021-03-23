using Microsoft.Azure.Cosmos;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.UserProfile.Services.CosmosDb
{
    public class UserProfileCosmosDbService : IUserProfileCosmosDbService
    {
        private Container _container;
        public UserProfileCosmosDbService(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddUserProfileAsync(Models.UserProfile userProfile)
        {
            await _container.CreateItemAsync<Models.UserProfile>(userProfile, new PartitionKey(userProfile.Id));
        }

        public async Task DeleteUserProfileAsync(string id)
        {
            await _container.DeleteItemAsync<Models.UserProfile>(id, new PartitionKey(id));
        }

        public async Task<Models.UserProfile> GetUserProfileAsync(string id)
        {
            try
            {
                ItemResponse<Models.UserProfile> response = await _container.ReadItemAsync<Models.UserProfile>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
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
