using System;
using System.Net;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Domain.Services;
using RIPA.Functions.Domain.Services.Contracts;

[assembly: FunctionsStartup(typeof(RIPA.Functions.Domain.Startup))]

namespace RIPA.Functions.Domain;

public class Startup : FunctionsStartup
{
    private readonly string _databaseName = Environment.GetEnvironmentVariable("DatabaseName");
    private readonly string _domainContainerName = Environment.GetEnvironmentVariable("ContainerNameDomain");
    private readonly string _account = Environment.GetEnvironmentVariable("Account");
    private readonly string _key = Environment.GetEnvironmentVariable("Key");
#if DEBUG
    private readonly string _localConnectionString = Environment.GetEnvironmentVariable("LocalConnectionString");
#endif
    private readonly CosmosClient _client;

    public Startup()
    {
        CosmosClientOptions clientOptions = new CosmosClientOptions();
#if DEBUG
        clientOptions.ConnectionMode = ConnectionMode.Gateway;
        clientOptions.WebProxy = new WebProxy()
        {
            BypassProxyOnLocal = true,
        };
        _client = new CosmosClient(_localConnectionString, clientOptions);
#else
        _client = new CosmosClient(_account, _key, clientOptions);
#endif
    }

    public override async void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddLogging();
        builder.Services.AddSingleton(InitializeCloudTableClient().GetAwaiter().GetResult());
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        var domainContainer = await CreateDomainContainerAsync();
        builder.Services.AddSingleton<IDomainCosmosDbService>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<DomainCosmosDbService>>();
            return new DomainCosmosDbService(domainContainer, logger);
        });
    }

    private static async Task<TableServiceClient> InitializeCloudTableClient()
    {
        var tableServiceClient = new TableServiceClient(Environment.GetEnvironmentVariable("RipaStorage"));

        await tableServiceClient.CreateTableIfNotExistsAsync("Beats");
        await tableServiceClient.CreateTableIfNotExistsAsync("Schools");
        await tableServiceClient.CreateTableIfNotExistsAsync("Cities");
        await tableServiceClient.CreateTableIfNotExistsAsync("Statutes");
        await tableServiceClient.CreateTableIfNotExistsAsync("Templates");

        return tableServiceClient;
    }

    private async Task<Container> CreateDomainContainerAsync()
    {
        DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
        ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_domainContainerName, "/id");
        return containerResponse.Container;
    }
}
