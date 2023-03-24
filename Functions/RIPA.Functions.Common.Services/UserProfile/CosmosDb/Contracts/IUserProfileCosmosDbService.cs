using RIPA.Functions.Common.Models.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;

public interface IUserProfileCosmosDbService
{
    Task<IEnumerable<dynamic>> GetUserProfilesAsync(string queryString);
    Task<dynamic> GetUserProfileAsync(string id);
    Task AddUserProfileAsync(IUserProfile userProfile);
    Task UpdateUserProfileAsync(string id, IUserProfile userProfile);
    Task DeleteUserProfileAsync(string id);
}
