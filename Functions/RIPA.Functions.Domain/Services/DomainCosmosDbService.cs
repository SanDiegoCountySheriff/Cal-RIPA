using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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

    public async Task<DomainDateTime> GetDomainUploadDate()
    {
        var response = await _container.ReadItemAsync<DomainDateTime>("1", new PartitionKey("1"));

        return response.Resource;
    }

    public async Task SetDomainUploadDate(DateTime uploadDate)
    {
        DomainDateTime domainDateTime = new()
        {
            Id = "1",
            Date = uploadDate
        };
        await _container.UpsertItemAsync(domainDateTime, new PartitionKey(domainDateTime.Id));
    }
}

public class DomainDateTime
{
    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("date")]
    public DateTime Date { get; set; }
}
