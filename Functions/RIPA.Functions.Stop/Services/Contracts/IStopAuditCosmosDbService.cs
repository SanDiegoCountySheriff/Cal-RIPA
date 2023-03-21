using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services.Contracts;

public interface IStopAuditCosmosDbService
{
    Task UpdateStopAuditAsync(string id, Common.Models.v1.Stop stop);
    Task<IEnumerable<Common.Models.v1.Stop>> GetStopAuditsAsync(string queryString);
}
