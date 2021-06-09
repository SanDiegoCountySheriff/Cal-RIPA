using Microsoft.Azure.Cosmos;
using RIPA.Functions.Stop.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services
{
    public class StopAuditCosmosDbService : IStopAuditCosmosDbService
    {

        private readonly Container _container;

        public StopAuditCosmosDbService(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }
        public async Task UpdateStopAuditAsync(string id, Common.Models.Stop stop)
        {
            await _container.UpsertItemAsync<Common.Models.Stop>(stop, new PartitionKey(id));
        }
    }
}
