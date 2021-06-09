using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services.Contracts
{
    public interface IStopAuditCosmosDbService
    {
        Task UpdateStopAuditAsync(string id, Common.Models.Stop stop);
    }
}
