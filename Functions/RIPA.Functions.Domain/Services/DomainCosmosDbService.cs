using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Domain.Services.Contracts;
using System;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Services;

public class DomainCosmosDbService : IDomainCosmosDbService
{
    private readonly ILogger<DomainCosmosDbService> _logger;
    private readonly Container _container;

    public DomainCosmosDbService(Container container, ILogger<DomainCosmosDbService> logger)
    {
        _logger = logger;
        _container = container;
    }

    public async Task<DateTime> GetDomainUploadDate()
    {
        var response = await _container.ReadItemAsync<DateTime>("1", new PartitionKey("1"));

        return response.Resource;
    }

    public async Task SetDomainUploadDate(DateTime uploadDate)
    {
        await _container.UpsertItemAsync(uploadDate, new PartitionKey("1"));
    }
}
