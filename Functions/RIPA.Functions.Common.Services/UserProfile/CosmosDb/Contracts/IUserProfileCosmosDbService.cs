using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;

public interface IUserProfileCosmosDbService
{
    Task<IEnumerable<Models.v1.UserProfile>> GetUserProfilesAsync(string queryString);
    Task<Models.v1.UserProfile> GetUserProfileAsync(string id);
    Task AddUserProfileAsync(Models.v1.UserProfile userProfile);
    Task UpdateUserProfileAsync(string id, Models.v1.UserProfile userProfile);
    Task DeleteUserProfileAsync(string id);
}
