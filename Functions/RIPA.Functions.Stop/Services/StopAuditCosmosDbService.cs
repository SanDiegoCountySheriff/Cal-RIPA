using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Stop.Services.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services;

public class StopAuditCosmosDbService<T> : IStopAuditCosmosDbService<T> where T : IStop
{
    private readonly ILogger<StopAuditCosmosDbService<T>> _logger;
    private readonly Container _container;

    public StopAuditCosmosDbService(Container container, ILogger<StopAuditCosmosDbService<T>> logger)
    {
        _logger = logger;
        _container = container;
    }

    public async Task<IEnumerable<T>> GetStopAuditsAsync(string queryString)
    {
        var query = _container.GetItemQueryIterator<T>(new QueryDefinition(queryString));
        List<T> results = new();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();
            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task UpdateStopAuditAsync(string id, T stop)
    {
        await _container.UpsertItemAsync(stop, new PartitionKey(id));
    }
}
