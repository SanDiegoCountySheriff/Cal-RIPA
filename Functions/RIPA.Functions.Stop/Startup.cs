using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.Stop.CosmosDb;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Stop.Services;
using RIPA.Functions.Stop.Services.Contracts;
using System;
using System.Net;
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

    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddLogging();

        var stopContainer = CreateStopContainerAsync().GetAwaiter().GetResult();
        builder.Services.AddSingleton<IStopCosmosDbService<Common.Models.v1.Stop>>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<StopCosmosDbService<Common.Models.v1.Stop>>>();
            return new StopCosmosDbService<Common.Models.v1.Stop>(stopContainer, logger);
        });

        builder.Services.AddSingleton<IStopCosmosDbService<Common.Models.v2.Stop>>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<StopCosmosDbService<Common.Models.v2.Stop>>>();
            return new StopCosmosDbService<Common.Models.v2.Stop>(stopContainer, logger);
        });

        var stopAuditContainer = CreateStopAuditContainerAsync().GetAwaiter().GetResult();
        builder.Services.AddSingleton<IStopAuditCosmosDbService<Common.Models.v1.Stop>>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<StopAuditCosmosDbService<Common.Models.v1.Stop>>>();
            return new StopAuditCosmosDbService<Common.Models.v1.Stop>(stopAuditContainer, logger);
        });

        builder.Services.AddSingleton<IStopAuditCosmosDbService<Common.Models.v2.Stop>>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<StopAuditCosmosDbService<Common.Models.v2.Stop>>>();
            return new StopAuditCosmosDbService<Common.Models.v2.Stop>(stopAuditContainer, logger);
        });

        var userProfileContainer = CreateUserProfileContainerAsync().GetAwaiter().GetResult();
        builder.Services.AddSingleton<IUserProfileCosmosDbService<Common.Models.v1.UserProfile>>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<UserProfileCosmosDbService<Common.Models.v1.UserProfile>>>();
            return new UserProfileCosmosDbService<Common.Models.v1.UserProfile>(userProfileContainer, logger);
        });

        builder.Services.AddSingleton<IUserProfileCosmosDbService<Common.Models.v2.UserProfile>>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<UserProfileCosmosDbService<Common.Models.v2.UserProfile>>>();
            return new UserProfileCosmosDbService<Common.Models.v2.UserProfile>(userProfileContainer, logger);
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
