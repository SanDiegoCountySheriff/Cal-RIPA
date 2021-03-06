﻿using Microsoft.Azure.Cosmos;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RIPA.Functions.Common.Models;

namespace RIPA.Functions.Stop.Services.CosmosDb
{
    public class StopCosmosDbService : IStopCosmosDbService
    {
        private readonly Container _container;

        public StopCosmosDbService(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddStopAsync(Common.Models.Stop stop)
        {
            await _container.CreateItemAsync<Common.Models.Stop>(stop, new PartitionKey(stop.Ori));
        }

        public async Task DeleteStopAsync(string id)
        {
            await _container.DeleteItemAsync<Common.Models.Stop>(id, new PartitionKey(id));
        }

        public async Task<Common.Models.Stop> GetStopAsync(string id)
        {
            try
            {
                ItemResponse<Common.Models.Stop> response = await _container.ReadItemAsync<Common.Models.Stop>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<Common.Models.Stop>> GetStopsAsync(string queryString)
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

        public async Task UpdateStopAsync(string id, Common.Models.Stop stop)
        {
            await _container.UpsertItemAsync<Common.Models.Stop>(stop, new PartitionKey(id));
        }
    }
}
