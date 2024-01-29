using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;

public interface IUserProfileCosmosDbService<T>
{
    Task<IEnumerable<T>> GetUserProfilesAsync(string queryString);
    Task<T> GetUserProfileAsync(string id);
    Task<IEnumerable<string>> GetUserProfileIdsAsync(string queryString);
    Task AddUserProfileAsync(T userProfile);
    Task UpdateUserProfileAsync(string id, T userProfile);
    Task DeleteUserProfileAsync(string id);
    Task UpdateFavoriteLocationCount(string favoriteName, string id);
    Task UpdateFavoriteReasonCount(string favoriteName, string id);
    Task UpdateFavoriteResultCount(string favoriteName, string id);
    Task RemoveOfficerGender();
}
