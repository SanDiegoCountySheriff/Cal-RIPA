using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using System;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(RIPA.Functions.UserProfile.Startup))]

namespace RIPA.Functions.UserProfile
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddLogging();
            builder.Services.AddSingleton<IUserProfileCosmosDbService>(InitializeCosmosClientInstanceAsync().GetAwaiter().GetResult());
        }

        private static async Task<UserProfileCosmosDbService> InitializeCosmosClientInstanceAsync()
        {
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("ContainerName");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            CosmosClientOptions clientOptions = new CosmosClientOptions();
#if DEBUG
            clientOptions.ConnectionMode = ConnectionMode.Gateway;
#endif
            CosmosClient client = new CosmosClient(account, key, clientOptions);
            UserProfileCosmosDbService cosmosDbService = new UserProfileCosmosDbService(client, databaseName, containerName);
            DatabaseResponse database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");

            return cosmosDbService;
        }
    }
}
