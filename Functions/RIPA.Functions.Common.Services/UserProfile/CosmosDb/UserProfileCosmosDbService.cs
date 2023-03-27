using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb;

public class UserProfileCosmosDbService<T> : IUserProfileCosmosDbService<T> where T : IUserProfile
{
    private readonly ILogger<UserProfileCosmosDbService<T>> _logger;
    private readonly Container _container;

    public UserProfileCosmosDbService(Container container, ILogger<UserProfileCosmosDbService<T>> logger)
    {
        _logger = logger;
        _container = container;
    }

    public async Task AddUserProfileAsync(T userProfile)
    {
        _logger.LogInformation($"Adding user profile: {userProfile.OfficerId}");
        await _container.CreateItemAsync(userProfile, new PartitionKey(userProfile.Id));
    }

    public async Task DeleteUserProfileAsync(string id)
    {
        _logger.LogInformation($"Deleting user profile: {id}");
        await _container.DeleteItemAsync<T>(id, new PartitionKey(id));
    }

    public async Task<T> GetUserProfileAsync(string id)
    {
        var response = await _container.ReadItemAsync<T>(id, new PartitionKey(id));

        return response.Resource;
    }

    public async Task<IEnumerable<T>> GetUserProfilesAsync(string queryString)
    {
        var query = _container.GetItemQueryIterator<T>(new QueryDefinition(queryString));
        List<T> results = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task UpdateUserProfileAsync(string id, T userProfile)
    {
        await _container.UpsertItemAsync(userProfile, new PartitionKey(id));
    }
}
