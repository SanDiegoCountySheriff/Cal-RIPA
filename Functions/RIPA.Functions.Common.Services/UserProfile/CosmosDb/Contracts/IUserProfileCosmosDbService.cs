using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;

public interface IUserProfileCosmosDbService
{
    Task<IEnumerable<Models.UserProfile>> GetUserProfilesAsync(string queryString);
    Task<Models.UserProfile> GetUserProfileAsync(string id);
    Task AddUserProfileAsync(Models.UserProfile userProfile);
    Task UpdateUserProfileAsync(string id, Models.UserProfile userProfile);
    Task DeleteUserProfileAsync(string id);
}
