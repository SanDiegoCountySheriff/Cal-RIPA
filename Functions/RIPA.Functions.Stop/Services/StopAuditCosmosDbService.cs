using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Stop.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services
{
    public class StopAuditCosmosDbService : IStopAuditCosmosDbService
    {
        private readonly ILogger<StopAuditCosmosDbService> _logger;
        private readonly Container _container;

        public StopAuditCosmosDbService(ILogger<StopAuditCosmosDbService> logger)
        {
            _logger = logger;
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("StopAuditContainerName");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            CosmosClientOptions clientOptions = new CosmosClientOptions();
#if DEBUG
            clientOptions.ConnectionMode = ConnectionMode.Gateway;
#endif
            CosmosClient client = new CosmosClient(account, key, clientOptions);

            _container = client.GetContainer(databaseName, containerName);
        }

        public async Task<IEnumerable<Common.Models.Stop>> GetStopAuditsAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<Common.Models.Stop>(new QueryDefinition(queryString));
            List<Common.Models.Stop> results = new List<Common.Models.Stop>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateStopAuditAsync(string id, Common.Models.Stop stop)
        {
            await _container.UpsertItemAsync<Common.Models.Stop>(stop, new PartitionKey(id));
        }
    }
}
