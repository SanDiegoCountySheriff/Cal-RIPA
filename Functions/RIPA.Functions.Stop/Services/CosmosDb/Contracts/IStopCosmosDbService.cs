using System.Collections.Generic;
using System.Threading.Tasks;
using RIPA.Functions.Common.Models;

namespace RIPA.Functions.Stop.Services.CosmosDb.Contracts
{
    public interface IStopCosmosDbService
    {
        Task<IEnumerable<Common.Models.Stop>> GetStopsAsync(string queryString);
        Task<Common.Models.Stop> GetStopAsync(string id);
        Task AddStopAsync(Common.Models.Stop stop);
        Task UpdateStopAsync(string id, Common.Models.Stop stop);
        Task DeleteStopAsync(string id);
    }
}
