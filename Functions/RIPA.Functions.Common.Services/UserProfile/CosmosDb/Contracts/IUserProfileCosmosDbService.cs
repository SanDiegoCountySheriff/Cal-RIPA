using RIPA.Functions.Common.Models.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;

public interface IUserProfileCosmosDbService<T>
{
    Task<IEnumerable<T>> GetUserProfilesAsync(string queryString);
    Task<T> GetUserProfileAsync(string id);
    Task AddUserProfileAsync(T userProfile);
    Task UpdateUserProfileAsync(string id, T userProfile);
    Task DeleteUserProfileAsync(string id);
}
