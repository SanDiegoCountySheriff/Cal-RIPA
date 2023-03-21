using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Stop.Services.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Services;

public class StopAuditCosmosDbService : IStopAuditCosmosDbService
{
    private readonly ILogger<StopAuditCosmosDbService> _logger;
    private readonly Container _container;

    public StopAuditCosmosDbService(Container container, ILogger<StopAuditCosmosDbService> logger)
    {
        _logger = logger;
        _container = container;
    }

    public async Task<IEnumerable<IStop>> GetStopAuditsAsync(string queryString)
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

    public async Task UpdateStopAuditAsync(string id, IStop stop)
    {
        await _container.UpsertItemAsync(stop, new PartitionKey(id));
    }
}
