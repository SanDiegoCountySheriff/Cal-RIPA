using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
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

    public async Task<IEnumerable<Common.Models.v1.Stop>> GetStopAuditsAsync(string queryString)
    {
        var query = _container.GetItemQueryIterator<Common.Models.v1.Stop>(new QueryDefinition(queryString));
        List<Common.Models.v1.Stop> results = new List<Common.Models.v1.Stop>();

        while (query.HasMoreResults)
        {
            var response = await query.ReadNextAsync();

            results.AddRange(response.ToList());
        }

        return results;
    }

    public async Task UpdateStopAuditAsync(string id, Common.Models.v1.Stop stop)
    {
        await _container.UpsertItemAsync(stop, new PartitionKey(id));
    }
}
