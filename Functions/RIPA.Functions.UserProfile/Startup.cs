using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using System;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(RIPA.Functions.UserProfile.Startup))]

namespace RIPA.Functions.UserProfile
{
    public class Startup : FunctionsStartup
    {
        private readonly string _databaseName = Environment.GetEnvironmentVariable("DatabaseName");
        private readonly string _containerName = Environment.GetEnvironmentVariable("ContainerName");
        private readonly string _account = Environment.GetEnvironmentVariable("Account");
        private readonly string _key = Environment.GetEnvironmentVariable("Key");
        private readonly CosmosClient _client;
        private readonly Container _container;

        public Startup()
        {
            CosmosClientOptions clientOptions = new CosmosClientOptions();
#if DEBUG
            clientOptions.ConnectionMode = ConnectionMode.Gateway;
#endif
            _client = new CosmosClient(_account, _key, clientOptions);
            _container = _client.GetContainer(_databaseName, _containerName);
        }

        public async override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddLogging();
            builder.Services.AddSingleton<IUserProfileCosmosDbService>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<UserProfileCosmosDbService>>();
                return new UserProfileCosmosDbService(_container, logger);
            });
            await CreateDatabaseAsync();
        }

        private async Task CreateDatabaseAsync()
        {
            DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(_containerName, "/id");
        }
    }
}
