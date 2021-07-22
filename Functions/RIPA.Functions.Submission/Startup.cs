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
using System.Net.Http;
using System.Threading.Tasks;


[assembly: FunctionsStartup(typeof(RIPA.Functions.Submission.Startup))]

namespace RIPA.Functions.Submission
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddLogging();
            builder.Services.AddSingleton<IStopService>(InitializeStopService());
            builder.Services.AddSingleton<ISftpService>(InitializeSftpService());
            builder.Services.AddSingleton<ISubmissionCosmosDbService>(InitializeSubmissionCosmosClientInstanceAsync().GetAwaiter().GetResult());
            builder.Services.AddSingleton<IStopCosmosDbService>(InitializeStopCosmosClientInstanceAsync().GetAwaiter().GetResult());
            builder.Services.AddSingleton<IUserProfileCosmosDbService>(InitializeUserProfileCosmosClientInstanceAsync().GetAwaiter().GetResult());
            builder.Services.AddSingleton<ISubmissionServiceBusService>(InitializeSubmissionServiceBusService());
            builder.Services.AddSingleton<IResultServiceBusService>(InitializeResultServiceBusService());
        }

        private static StopService InitializeStopService()
        {
            return new StopService();
        }

        private static SftpService InitializeSftpService()
        {
            SftpConfig sftpConfig = new SftpConfig
            {
                Host = Environment.GetEnvironmentVariable("SftpHost"),
                Port = Convert.ToInt32(Environment.GetEnvironmentVariable("SftpPort")),
                UserName = Environment.GetEnvironmentVariable("SftpUserName"),
                Password = Environment.GetEnvironmentVariable("SftpPassword"),
                Key = Environment.GetEnvironmentVariable("SftpKey")
            };
#if DEBUG
            sftpConfig.Key = File.ReadAllText(@"C:\Users\LPOPE\source\repos\DOJ Attachments\Keys\lplp.ppk");
#endif
            LoggerFactory loggerFactory = new LoggerFactory();
            return new SftpService(loggerFactory.CreateLogger(typeof(SftpService)), sftpConfig);
        }

        private static async Task<SubmissionCosmosDbService> InitializeSubmissionCosmosClientInstanceAsync()
        {
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("ContainerNameSubmissions");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            Microsoft.Azure.Cosmos.CosmosClient client = new Microsoft.Azure.Cosmos.CosmosClient(account, key);
            SubmissionCosmosDbService cosmosDbService = new SubmissionCosmosDbService(client, databaseName, containerName);
            Microsoft.Azure.Cosmos.DatabaseResponse database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");

            return cosmosDbService;
        }

        private static async Task<StopCosmosDbService> InitializeStopCosmosClientInstanceAsync()
        {
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("ContainerNameStops");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            Microsoft.Azure.Cosmos.CosmosClient client = new Microsoft.Azure.Cosmos.CosmosClient(account, key);
            StopCosmosDbService cosmosDbService = new StopCosmosDbService(client, databaseName, containerName);
            Microsoft.Azure.Cosmos.DatabaseResponse database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");

            return cosmosDbService;
        }

        private static async Task<UserProfileCosmosDbService> InitializeUserProfileCosmosClientInstanceAsync()
        {
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("UserProfileContainerName");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            Microsoft.Azure.Cosmos.CosmosClient client = new Microsoft.Azure.Cosmos.CosmosClient(account, key);
            UserProfileCosmosDbService cosmosDbService = new UserProfileCosmosDbService(client, databaseName, containerName);
            Microsoft.Azure.Cosmos.DatabaseResponse database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");

            return cosmosDbService;
        }

        private static SubmissionServiceBusService InitializeSubmissionServiceBusService()
        {
            LoggerFactory loggerFactory = new LoggerFactory();
            return new SubmissionServiceBusService(Environment.GetEnvironmentVariable("ServiceBusConnection"), "submission", loggerFactory.CreateLogger(typeof(SubmissionServiceBusService)));
        }

        private static ResultServiceBusService InitializeResultServiceBusService()
        {
            LoggerFactory loggerFactory = new LoggerFactory();
            return new ResultServiceBusService(Environment.GetEnvironmentVariable("ServiceBusConnection"), "result", loggerFactory.CreateLogger(typeof(ResultServiceBusService)));
        }
    }
}
