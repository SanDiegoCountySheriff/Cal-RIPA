using RIPA.Functions.Common.Models.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;

public interface IUserProfileCosmosDbService
{
    Task<IEnumerable<IUserProfile>> GetUserProfilesAsync(string queryString);
    Task<IUserProfile> GetUserProfileAsync(string id);
    Task AddUserProfileAsync(IUserProfile userProfile);
    Task UpdateUserProfileAsync(string id, IUserProfile userProfile);
    Task DeleteUserProfileAsync(string id);
}
