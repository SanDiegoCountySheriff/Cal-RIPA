using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models.Interfaces;
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

    public async Task AddUserProfileAsync(IUserProfile userProfile)
    {
        _logger.LogInformation($"Adding user profile: {userProfile.OfficerId}");
        await _container.CreateItemAsync(userProfile, new PartitionKey(userProfile.Id));
    }

    public async Task DeleteUserProfileAsync(string id)
    {
        _logger.LogInformation($"Deleting user profile: {id}");
        await _container.DeleteItemAsync<IUserProfile>(id, new PartitionKey(id));
    }

    public async Task<dynamic> GetUserProfileAsync(string id)
    {
        var response = await _container.ReadItemAsync<dynamic>(id, new PartitionKey(id));

        return response.Resource;
    }

    public async Task<IEnumerable<dynamic>> GetUserProfilesAsync(string queryString)
    {
        var query = _container.GetItemQueryIterator<dynamic>(new QueryDefinition(queryString));
        List<dynamic> results = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task UpdateUserProfileAsync(string id, IUserProfile userProfile)
    {
        await _container.UpsertItemAsync(userProfile, new PartitionKey(id));
    }
}
