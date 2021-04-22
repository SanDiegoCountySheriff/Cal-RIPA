using Microsoft.Azure.Cosmos;
using RIPA.Functions.Statute.Services.CosmosDb.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Statute.Services.CosmosDb
{
    public class StatuteCosmosDbService : IStatuteCosmosDbService
    {
        private readonly Container _container;

        public StatuteCosmosDbService(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }
        public async Task AddStatuteAsync(Models.Statute statute)
        {
            await _container.CreateItemAsync<Models.Statute>(statute, new PartitionKey(statute.Id));
        }

        public async Task DeleteStatuteAsync(string id)
        {
            await _container.DeleteItemAsync<Models.Statute>(id, new PartitionKey(id));
        }

        public async Task<Models.Statute> GetStatuteAsync(string id)
        {
            try
            {
                ItemResponse<Models.Statute> response = await _container.ReadItemAsync<Models.Statute>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<Models.Statute>> GetStatutesAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<Models.Statute>(new QueryDefinition(queryString));
            List<Models.Statute> results = new List<Models.Statute>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateStatuteAsync(string id, Models.Statute statute)
        {
            await _container.UpsertItemAsync<Models.Statute>(statute, new PartitionKey(id));
        }
    }
}
