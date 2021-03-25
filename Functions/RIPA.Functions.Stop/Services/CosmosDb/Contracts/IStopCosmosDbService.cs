using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services.CosmosDb.Contracts
{
    public interface IStopCosmosDbService
    {
        Task<IEnumerable<Models.Stop>> GetStopsAsync(string queryString);
        Task<Models.Stop> GetStopAsync(string id);
        Task AddStopAsync(Models.Stop stop);
        Task UpdateStopAsync(string id, Models.Stop stop);
        Task DeleteStopAsync(string id);
    }
}
