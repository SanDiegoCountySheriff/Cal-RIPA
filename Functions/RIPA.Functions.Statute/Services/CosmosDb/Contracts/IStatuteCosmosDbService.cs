using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Statute.Services.CosmosDb.Contracts
{
    public interface IStatuteCosmosDbService
    {
        Task<IEnumerable<Models.Statute>> GetStatutesAsync(string queryString);
        Task<Models.Statute> GetStatuteAsync(string id);
        Task AddStatuteAsync(Models.Statute statute);
        Task UpdateStatuteAsync(string id, Models.Statute statute);
        Task DeleteStatuteAsync(string id);
    }
}
