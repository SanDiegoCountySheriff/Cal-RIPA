using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Submission.Services.CosmosDb;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.REST;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Net.Http;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(RIPA.Functions.Submission.Startup))]

namespace RIPA.Functions.Submission
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IStopService>(InitializeStopService());
            builder.Services.AddSingleton<ISftpService>(InitializeSftpService());
            builder.Services.AddSingleton<ISubmissionCosmosDbService>(InitializeCosmosClientInstanceAsync().GetAwaiter().GetResult());
        }

        private static StopService InitializeStopService()
        {
            return new StopService(new HttpClient(), Environment.GetEnvironmentVariable("GetStopUrl"), Environment.GetEnvironmentVariable("PutStopUrl"));
        }

        private static SftpService InitializeSftpService()
        {
            SftpConfig sftpConfig = new SftpConfig
            {
                Host = Environment.GetEnvironmentVariable("SftpHost"),
                Port = Convert.ToInt32(Environment.GetEnvironmentVariable("SftpPort")),
                UserName = Environment.GetEnvironmentVariable("SftpUserName"),
                Password = Environment.GetEnvironmentVariable("SftpPassword")
            };
            LoggerFactory loggerFactory = new LoggerFactory();
            return new SftpService(loggerFactory.CreateLogger(typeof(SftpService)), sftpConfig);
        }

        private static async Task<SubmissionCosmosDbService> InitializeCosmosClientInstanceAsync()
        {
            string databaseName = Environment.GetEnvironmentVariable("DatabaseName");
            string containerName = Environment.GetEnvironmentVariable("ContainerName");
            string account = Environment.GetEnvironmentVariable("Account");
            string key = Environment.GetEnvironmentVariable("Key");
            Microsoft.Azure.Cosmos.CosmosClient client = new Microsoft.Azure.Cosmos.CosmosClient(account, key);
            SubmissionCosmosDbService cosmosDbService = new SubmissionCosmosDbService(client, databaseName, containerName);
            Microsoft.Azure.Cosmos.DatabaseResponse database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/id");

            return cosmosDbService;
        }
    }
}
