using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using System;
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

    public async Task<IEnumerable<string>> GetUserProfileIdsAsync(string queryString)
    {
        var query = _container.GetItemQueryIterator<string>(new QueryDefinition(queryString));
        List<string> results = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task UpdateFavoriteLocationCount(string favoriteName, string id)
    {
        var query = _container.GetItemQueryIterator<T>(new QueryDefinition($"SELECT * FROM c WHERE c.officerId = '{id}'"));
        Models.v2.UserProfile result = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            result = response.FirstOrDefault() as Models.v2.UserProfile;
        }

        var favoriteLocations = JsonConvert.DeserializeObject<dynamic[]>(result.FavoriteLocations);
        var favoriteLocation = favoriteLocations.Where(l => l.name == favoriteName).FirstOrDefault();
        var index = Array.IndexOf(favoriteLocations, favoriteLocation);
        if (favoriteLocation.count != null)
        {
            favoriteLocation.count = (int)favoriteLocation.count + 1;
        }
        else
        {
            favoriteLocation.count = 1;
        }
        favoriteLocations[index] = favoriteLocation;
        string serializedFavorite = JsonConvert.SerializeObject(favoriteLocations);
        result.FavoriteLocations = serializedFavorite;

        await _container.UpsertItemAsync(result, new PartitionKey(result.Id));
    }

    public async Task UpdateFavoriteReasonCount(string favoriteName, string id)
    {
        var query = _container.GetItemQueryIterator<T>(new QueryDefinition($"SELECT * FROM c WHERE c.officerId = '{id}'"));
        Models.v2.UserProfile result = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            result = response.FirstOrDefault() as Models.v2.UserProfile;
        }

        var favoriteReasons = JsonConvert.DeserializeObject<dynamic[]>(result.FavoriteReasons);
        var favoriteReason = favoriteReasons.Where(l => l.name == favoriteName).FirstOrDefault();
        var index = Array.IndexOf(favoriteReasons, favoriteReason);
        if (favoriteReason.count != null)
        {
            favoriteReason.count = (int)favoriteReason.count + 1;
        }
        else
        {
            favoriteReason.count = 1;
        }
        favoriteReasons[index] = favoriteReason;
        string serializedFavorite = JsonConvert.SerializeObject(favoriteReasons);
        result.FavoriteReasons = serializedFavorite;

        await _container.UpsertItemAsync(result, new PartitionKey(result.Id));
    }

    public async Task UpdateFavoriteResultCount(string favoriteName, string id)
    {
        var query = _container.GetItemQueryIterator<T>(new QueryDefinition($"SELECT * FROM c WHERE c.officerId = '{id}'"));
        Models.v2.UserProfile result = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            result = response.FirstOrDefault() as Models.v2.UserProfile;
        }

        var favoriteResults = JsonConvert.DeserializeObject<dynamic[]>(result.FavoriteResults);
        var favoriteResult = favoriteResults.Where(l => l.name == favoriteName).FirstOrDefault();
        var index = Array.IndexOf(favoriteResults, favoriteResult);
        if (favoriteResult.count != null)
        {
            favoriteResult.count = (int)favoriteResult.count + 1;
        }
        else
        {
            favoriteResult.count = 1;
        }
        favoriteResults[index] = favoriteResult;
        string serializedFavorite = JsonConvert.SerializeObject(favoriteResults);
        result.FavoriteResults = serializedFavorite;

        await _container.UpsertItemAsync(result, new PartitionKey(result.Id));
    }

    public async Task UpdateUserProfileAsync(string id, T userProfile)
    {
        await _container.UpsertItemAsync(userProfile, new PartitionKey(id));
    }
}
