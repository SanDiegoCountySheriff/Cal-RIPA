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

        public async Task<bool> CheckForDuplicateStop(string stopId, string ori, string officerId, string date, string time)
        {
            string queryString = $"SELECT * FROM c WHERE c.id != '{stopId}' AND c.Ori = '{ori}' AND c.OfficerId = '{officerId}' AND c.Date = '{date}' AND c.Time = '{time}'";
            var queryDefinition = new QueryDefinition(queryString);
            
            var results = _container.GetItemQueryIterator<Common.Models.Stop>(queryDefinition);

            List<Common.Models.Stop> matchingStops = new List<Common.Models.Stop>();
            while (results.HasMoreResults)
            {
                var response = await results.ReadNextAsync();
                matchingStops.AddRange(response.ToList());
            }

            return matchingStops.Count > 0;
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

        public async Task<IEnumerable<Common.Models.SubmissionErrorSummary>> GetSubmissionErrorSummaries(string id)
        {
            var queryString = $"SELECT COUNT(ListSubmissionError.Code) AS Count, ListSubmissionError.Code FROM c JOIN ListSubmission IN c.ListSubmission JOIN ListSubmissionError IN ListSubmission.ListSubmissionError WHERE ListSubmission.Id = '{id}' GROUP BY ListSubmissionError.Code";
            var query = _container.GetItemQueryIterator<Common.Models.SubmissionErrorSummary>(new QueryDefinition(queryString));
            List<Common.Models.SubmissionErrorSummary> results = new List<Common.Models.SubmissionErrorSummary>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }
            return results;
        }

        public async Task<IEnumerable<Common.Models.SubmissionStopDateTimeSummary>> GetSubmissionStopDateTimeSummaries(string id)
        {
            var queryString = $"Select Max(c.StopDateTime) AS MaxStopDateTime, Min(c.StopDateTime) AS MinStopDateTime FROM c JOIN ListSubmission IN c.ListSubmission WHERE ListSubmission.Id = '{id}'";
            var query = _container.GetItemQueryIterator<Common.Models.SubmissionStopDateTimeSummary>(new QueryDefinition(queryString));
            List<Common.Models.SubmissionStopDateTimeSummary> results = new List<Common.Models.SubmissionStopDateTimeSummary>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }
            return results;
        }


        public async Task<IEnumerable<Common.Models.DojError>> GetErrorCodes(string inputText, string submissionId)
        {
            var queryString = $"SELECT ListSubmissionError.Code Code, ListSubmissionError.Message Message FROM Code JOIN ListSubmission IN Code.ListSubmission JOIN ListSubmissionError IN ListSubmission.ListSubmissionError WHERE CONTAINS(ListSubmissionError.Code, '{inputText}', true) OR CONTAINS(ListSubmissionError.Message, '{inputText}', true)";
            if (!String.IsNullOrWhiteSpace(submissionId))
            {
                queryString += $" AND ListSubmission.Id = '{submissionId}'";
            }
            var query = _container.GetItemQueryIterator<Common.Models.DojError>(new QueryDefinition(queryString));
            List<Common.Models.DojError> results = new List<Common.Models.DojError>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }
            return results;
        }

    }
}
