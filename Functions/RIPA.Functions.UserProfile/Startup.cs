using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using System;
using System.Net;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(RIPA.Functions.UserProfile.Startup))]

namespace RIPA.Functions.UserProfile;

public class Startup : FunctionsStartup
{
    private readonly string _databaseName = Environment.GetEnvironmentVariable("DatabaseName");
    private readonly string _userProfileContainerName = Environment.GetEnvironmentVariable("ContainerName");
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

    private async Task<Container> CreateUserProfileContainerAsync()
    {
        DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
        var containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_userProfileContainerName, "/id");
        return containerResponse.Container;
    }
}
