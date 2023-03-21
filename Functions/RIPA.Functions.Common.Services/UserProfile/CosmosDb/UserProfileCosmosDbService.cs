using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb;

public class UserProfileCosmosDbService : IUserProfileCosmosDbService
{
    private readonly ILogger<UserProfileCosmosDbService> _logger;
    private readonly Container _container;

    public UserProfileCosmosDbService(Container container, ILogger<UserProfileCosmosDbService> logger)
    {
        _logger = logger;
        _container = container;
    }

    public async Task AddUserProfileAsync(Models.v1.UserProfile userProfile)
    {
        _logger.LogInformation($"Adding user profile: {userProfile.OfficerId}");
        await _container.CreateItemAsync(userProfile, new PartitionKey(userProfile.Id));
    }

    public async Task DeleteUserProfileAsync(string id)
    {
        _logger.LogInformation($"Deleting user profile: {id}");
        await _container.DeleteItemAsync<Models.v1.UserProfile>(id, new PartitionKey(id));
    }

    public async Task<Models.v1.UserProfile> GetUserProfileAsync(string id)
    {
        ItemResponse<Models.v1.UserProfile> response = await _container.ReadItemAsync<Models.v1.UserProfile>(id, new PartitionKey(id));

        return response.Resource;
    }

    public async Task<IEnumerable<Models.v1.UserProfile>> GetUserProfilesAsync(string queryString)
    {
        var query = _container.GetItemQueryIterator<Models.v1.UserProfile>(new QueryDefinition(queryString));
        List<Models.v1.UserProfile> results = new List<Models.v1.UserProfile>();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task UpdateUserProfileAsync(string id, Models.v1.UserProfile userProfile)
    {
        await _container.UpsertItemAsync(userProfile, new PartitionKey(id));
    }
}
