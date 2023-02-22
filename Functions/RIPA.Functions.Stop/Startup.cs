using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Services.Stop.CosmosDb;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Stop.Services;
using RIPA.Functions.Stop.Services.Contracts;
using System;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(RIPA.Functions.Stop.Startup))]

namespace RIPA.Functions.Stop;

public class Startup : FunctionsStartup
{
    private readonly string _databaseName = Environment.GetEnvironmentVariable("DatabaseName");
    private readonly string _stopAuditContainerName = Environment.GetEnvironmentVariable("StopAuditContainerName");
    private readonly string _stopContainerName = Environment.GetEnvironmentVariable("StopContainerName");
    private readonly string _userProfileContainerName = Environment.GetEnvironmentVariable("UserProfileContainerName");
    private readonly string _account = Environment.GetEnvironmentVariable("Account");
    private readonly string _key = Environment.GetEnvironmentVariable("Key");
    private readonly CosmosClient _client;

    public Startup()
    {
        CosmosClientOptions clientOptions = new CosmosClientOptions();
#if DEBUG
        clientOptions.ConnectionMode = ConnectionMode.Gateway;
#endif
        _client = new CosmosClient(_account, _key, clientOptions);
    }

    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddLogging();
        var stopContainer = CreateStopContainerAsync().GetAwaiter().GetResult();
        builder.Services.AddSingleton<IStopCosmosDbService>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<StopCosmosDbService>>();
            return new StopCosmosDbService(stopContainer, logger);
        });
        var stopAuditContainer = CreateStopAuditContainerAsync().GetAwaiter().GetResult();
        builder.Services.AddSingleton<IStopAuditCosmosDbService>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<StopAuditCosmosDbService>>();
            return new StopAuditCosmosDbService(stopAuditContainer, logger);
        });
        var userProfileContainer = CreateUserProfileContainerAsync().GetAwaiter().GetResult();
        builder.Services.AddSingleton<IUserProfileCosmosDbService>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<UserProfileCosmosDbService>>();
            return new UserProfileCosmosDbService(userProfileContainer, logger);
        });
    }

    private async Task<Container> CreateStopContainerAsync()
    {
        DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
        ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_stopContainerName, "/id");
        return containerResponse.Container;
    }

    private async Task<Container> CreateStopAuditContainerAsync()
    {
        DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
        ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_stopAuditContainerName, "/id");
        return containerResponse.Container;
    }

    private async Task<Container> CreateUserProfileContainerAsync()
    {
        DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
        ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_userProfileContainerName, "/id");
        return containerResponse.Container;
    }
}
