using RIPA.Functions.Common.Models.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services.Contracts;

public interface IStopAuditCosmosDbService<T>
{
    Task UpdateStopAuditAsync(string id, T stop);
    Task<IEnumerable<T>> GetStopAuditsAsync(string queryString);
}
