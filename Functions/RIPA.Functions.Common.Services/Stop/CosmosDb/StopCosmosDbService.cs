using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.Stop.CosmosDb;

public class StopCosmosDbService : IStopCosmosDbService
{
    private readonly ILogger<StopCosmosDbService> _logger;
    private readonly Container _container;
    private readonly char[] BASE36_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();

    public StopCosmosDbService(Container container, ILogger<StopCosmosDbService> logger)
    {
        _logger = logger;
        _container = container;
    }

    public async Task AddStopAsync(IStop stop)
    {
        DateTime now = DateTime.Now;
        StringBuilder sb = new StringBuilder();

        sb.Append(stop.OfficerId.Substring(5, 4));
        sb.Append(BASE36_CHARS[now.Year - 2021]);
        sb.Append(BASE36_CHARS[now.Month]);
        sb.Append(BASE36_CHARS[now.Day]);
        sb.Append(BASE36_CHARS[now.Hour]);
        sb.Append(now.ToString("mmss"));

        stop.Id = sb.ToString();

        await _container.CreateItemAsync(stop, new PartitionKey(stop.Id));
    }

    public async Task UpdateStopAsync(IStop stop)
    {
        await _container.UpsertItemAsync(stop, new PartitionKey(stop.Id));
    }

    public async Task DeleteStopAsync(string id)
    {
        await _container.DeleteItemAsync<IStop>(id, new PartitionKey(id));
    }

    public async Task<IStop> GetStopAsync(string id)
    {
        ItemResponse<IStop> response = await _container.ReadItemAsync<IStop>(id, new PartitionKey(id));
        return response.Resource;
    }

    public async Task<bool> CheckForDuplicateStop(string stopId, string ori, string officerId, string date, string time)
    {
        string queryString = $"SELECT * FROM c WHERE c.id != '{stopId}' AND c.Ori = '{ori}' AND c.OfficerId = '{officerId}' AND c.Date = '{date}' AND c.Time = '{time}'";
        var queryDefinition = new QueryDefinition(queryString);

        var results = _container.GetItemQueryIterator<Models.v1.Stop>(queryDefinition);

        List<IStop> matchingStops = new();

        while (results.HasMoreResults)
        {
            var response = await results.ReadNextAsync();
            matchingStops.AddRange(response.ToList());
        }

        return matchingStops.Count > 0;
    }

    public async Task<IEnumerable<IStop>> GetStopsAsync(string queryString)
    {
        var query = _container.GetItemQueryIterator<IStop>(new QueryDefinition(queryString));
        List<IStop> results = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task<IEnumerable<StopStatusCount>> GetStopStatusCounts(string queryString)
    {
        var query = _container.GetItemQueryIterator<StopStatusCount>(new QueryDefinition(queryString));
        List<StopStatusCount> results = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task<IEnumerable<SubmissionErrorSummary>> GetSubmissionErrorSummaries(string id)
    {
        var queryString = $"SELECT COUNT(ListSubmissionError.Code) AS Count, ListSubmissionError.Code FROM c JOIN ListSubmission IN c.ListSubmission JOIN ListSubmissionError IN ListSubmission.ListSubmissionError WHERE ListSubmission.Id = '{id}' GROUP BY ListSubmissionError.Code";
        var query = _container.GetItemQueryIterator<SubmissionErrorSummary>(new QueryDefinition(queryString));
        List<SubmissionErrorSummary> results = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task<IEnumerable<SubmissionStopDateTimeSummary>> GetSubmissionStopDateTimeSummaries(string id)
    {
        var queryString = $"Select Max(c.StopDateTime) AS MaxStopDateTime, Min(c.StopDateTime) AS MinStopDateTime FROM c JOIN ListSubmission IN c.ListSubmission WHERE ListSubmission.Id = '{id}'";
        var query = _container.GetItemQueryIterator<SubmissionStopDateTimeSummary>(new QueryDefinition(queryString));
        List<SubmissionStopDateTimeSummary> results = new();
        
        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task<IEnumerable<DojError>> GetErrorCodes(string inputText, string submissionId)
    {
        var queryString = $"SELECT ListSubmissionError.Code Code, ListSubmissionError.Message Message FROM Code JOIN ListSubmission IN Code.ListSubmission JOIN ListSubmissionError IN ListSubmission.ListSubmissionError WHERE CONTAINS(ListSubmissionError.Code, '{inputText}', true) OR CONTAINS(ListSubmissionError.Message, '{inputText}', true)";
        
        if (!string.IsNullOrWhiteSpace(submissionId))
        {
            queryString += $" AND ListSubmission.Id = '{submissionId}'";
        }

        var query = _container.GetItemQueryIterator<DojError>(new QueryDefinition(queryString));
        List<DojError> results = new();
        
        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }
}
