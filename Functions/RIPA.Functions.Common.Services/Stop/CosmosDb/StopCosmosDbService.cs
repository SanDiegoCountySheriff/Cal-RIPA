using Microsoft.Azure.Cosmos;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.Stop.CosmosDb
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

        public async Task<IEnumerable<Common.Models.StopStatusCount>> GetStopStatusCounts(string queryString)
        {
            var query = _container.GetItemQueryIterator<Common.Models.StopStatusCount>(new QueryDefinition(queryString));
            List<Common.Models.StopStatusCount> results = new List<Common.Models.StopStatusCount>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }
            return results;
        }

        public async Task<IEnumerable<Common.Models.ErrorCode>> GetErrorCodes(string inputText)
        {
            var queryString = $"SELECT submission.Error.Error ErrorMessage from ErrorMessage JOIN submission in ErrorMessage.ListSubmission WHERE CONTAINS(submission.Error.Error, '{inputText}')";
            var query = _container.GetItemQueryIterator<Common.Models.ErrorCode>(new QueryDefinition(queryString));
            List<Common.Models.ErrorCode> results = new List<Common.Models.ErrorCode>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }
            return results;
        }

    }
}
