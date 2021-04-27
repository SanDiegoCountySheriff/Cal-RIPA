using Microsoft.Azure.Cosmos;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services.CosmosDb
{
    public class StopCosmosDbService : IStopCosmosDbService
    {
        private readonly Container _container;

        public StopCosmosDbService(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddStopAsync(Models.Stop stop)
        {
            await _container.CreateItemAsync<Models.Stop>(stop, new PartitionKey(stop.ori));
        }

        public async Task DeleteStopAsync(string id)
        {
            await _container.DeleteItemAsync<Models.Stop>(id, new PartitionKey(id));
        }

        public async Task<Models.Stop> GetStopAsync(string id)
        {
            try
            {
                ItemResponse<Models.Stop> response = await _container.ReadItemAsync<Models.Stop>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<Models.Stop>> GetStopsAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<Models.Stop>(new QueryDefinition(queryString));
            List<Models.Stop> results = new List<Models.Stop>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateStopAsync(string id, Models.Stop stop)
        {
            await _container.UpsertItemAsync<Models.Stop>(stop, new PartitionKey(id));
        }
    }
}
