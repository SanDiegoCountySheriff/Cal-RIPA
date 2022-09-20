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
        private readonly string _databaseName = Environment.GetEnvironmentVariable("DatabaseName");
        private readonly string _submissionContainerName = Environment.GetEnvironmentVariable("ContainerNameSubmissions");
        private readonly string _stopContainerName = Environment.GetEnvironmentVariable("ContainerNameStops");
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

        public async override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddLogging();
            builder.Services.AddTransient<IStopService, StopService>();
            builder.Services.AddSingleton<ISftpService, SftpService>();
            var submissionContainer = await InitializeSubmissionCosmosClientInstanceAsync();
            builder.Services.AddSingleton<ISubmissionCosmosDbService>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<SubmissionCosmosDbService>>();
                return new SubmissionCosmosDbService(submissionContainer, logger);
            });
            var stopContainer = await InitializeStopCosmosClientInstanceAsync();
            builder.Services.AddSingleton<IStopCosmosDbService>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<StopCosmosDbService>>();
                return new StopCosmosDbService(stopContainer, logger);
            });
            var userProfileContainer = await InitializeUserProfileCosmosClientInstanceAsync();
            builder.Services.AddSingleton<IUserProfileCosmosDbService>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<UserProfileCosmosDbService>>();
                return new UserProfileCosmosDbService(userProfileContainer, logger);
            });
            builder.Services.AddSingleton<ISubmissionServiceBusService, SubmissionServiceBusService>();
            builder.Services.AddSingleton<IResultServiceBusService, ResultServiceBusService>();
        }

        private async Task<Container> InitializeSubmissionCosmosClientInstanceAsync()
        {
            DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
            ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_submissionContainerName, "/id");
            return containerResponse.Container;
        }

        private async Task<Container> InitializeStopCosmosClientInstanceAsync()
        {
            DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
            ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_stopContainerName, "/id");
            return containerResponse.Container;
        }

        private async Task<Container> InitializeUserProfileCosmosClientInstanceAsync()
        {
            DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
            ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_userProfileContainerName, "/id");
            return containerResponse.Container;
        }
    }
}
