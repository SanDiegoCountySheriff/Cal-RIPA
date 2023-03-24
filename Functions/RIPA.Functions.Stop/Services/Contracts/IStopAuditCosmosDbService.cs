using RIPA.Functions.Common.Models.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services.Contracts;

public interface IStopAuditCosmosDbService
{
    Task UpdateStopAuditAsync(string id, IStop stop);
    Task<IEnumerable<IStop>> GetStopAuditsAsync(string queryString);
}
