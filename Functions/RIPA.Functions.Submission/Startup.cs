using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Services.Stop.CosmosDb;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.CosmosDb;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.REST;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.ServiceBus;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using RIPA.Functions.Submission.Services.SFTP;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.IO;
using System.Threading.Tasks;


[assembly: FunctionsStartup(typeof(RIPA.Functions.Submission.Startup))]

namespace RIPA.Functions.Submission
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddLogging();
            builder.Services.AddTransient<IStopService, StopService>();
            builder.Services.AddSingleton<ISftpService, SftpService>();
            builder.Services.AddSingleton<ISubmissionCosmosDbService, SubmissionCosmosDbService>();
            InitializeSubmissionCosmosClientInstanceAsync().GetAwaiter().GetResult();
            builder.Services.AddSingleton<IStopCosmosDbService, StopCosmosDbService>();
            InitializeStopCosmosClientInstanceAsync().GetAwaiter().GetResult();
            builder.Services.AddSingleton<IUserProfileCosmosDbService, UserProfileCosmosDbService>();
            InitializeUserProfileCosmosClientInstanceAsync().GetAwaiter().GetResult();
            builder.Services.AddSingleton<ISubmissionServiceBusService, SubmissionServiceBusService>();
            builder.Services.AddSingleton<IResultServiceBusService, ResultServiceBusService>();
        }

        private static async Task InitializeSubmissionCosmosClientInstanceAsync()
        {
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("ContainerNameSubmissions");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            CosmosClientOptions clientOptions = new CosmosClientOptions();
#if DEBUG
            clientOptions.ConnectionMode = ConnectionMode.Gateway;
#endif
            CosmosClient client = new CosmosClient(account, key, clientOptions);
            DatabaseResponse database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");
        }

        private static async Task InitializeStopCosmosClientInstanceAsync()
        {
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("ContainerNameStops");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            CosmosClientOptions clientOptions = new CosmosClientOptions()
            {
                RequestTimeout = TimeSpan.FromMinutes(2),
                ApplicationName = "RIPA.Functions.Submission"
            };
#if DEBUG
            clientOptions.ConnectionMode = ConnectionMode.Gateway;
#endif
            CosmosClient client = new CosmosClient(account, key, clientOptions);
            DatabaseResponse database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");
        }

        private static async Task InitializeUserProfileCosmosClientInstanceAsync()
        {
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("UserProfileContainerName");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            CosmosClientOptions clientOptions = new CosmosClientOptions();
#if DEBUG
            clientOptions.ConnectionMode = ConnectionMode.Gateway;
#endif
            CosmosClient client = new CosmosClient(account, key, clientOptions);
            DatabaseResponse database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");
        }
    }
}
