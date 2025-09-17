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
using RIPA.Functions.Submission.Services.ServiceBus;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using RIPA.Functions.Submission.Services.SFTP;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Net;
using System.Threading.Tasks;


[assembly: FunctionsStartup(typeof(RIPA.Functions.Submission.Startup))]

namespace RIPA.Functions.Submission;

public class Startup : FunctionsStartup
{
    private readonly string _databaseName = Environment.GetEnvironmentVariable("DatabaseName");
    private readonly string _submissionContainerName = Environment.GetEnvironmentVariable("ContainerNameSubmissions");
    private readonly string _stopContainerName = Environment.GetEnvironmentVariable("ContainerNameStops");
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
        builder.Services.AddTransient<Services.REST.v1.Contracts.IStopService, Services.REST.v1.StopService>();
        builder.Services.AddTransient<Services.REST.v2.Contracts.IStopService, Services.REST.v2.StopService>();
        builder.Services.AddScoped<ISftpService, SftpService>();

        var submissionContainer = CreateSubmissionContainerAsync().GetAwaiter().GetResult();
        builder.Services.AddSingleton<ISubmissionCosmosDbService>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<SubmissionCosmosDbService>>();
            return new SubmissionCosmosDbService(submissionContainer, logger);
        });

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

        builder.Services.AddSingleton<ISubmissionServiceBusService, SubmissionServiceBusService>();
        builder.Services.AddSingleton<IResultServiceBusService, ResultServiceBusService>();
    }

    private async Task<Container> CreateSubmissionContainerAsync()
    {
        DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
        ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_submissionContainerName, "/id");
        return containerResponse.Container;
    }

    private async Task<Container> CreateStopContainerAsync()
    {
        DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
        ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_stopContainerName, "/id");
        return containerResponse.Container;
    }

    private async Task<Container> CreateUserProfileContainerAsync()
    {
        DatabaseResponse database = await _client.CreateDatabaseIfNotExistsAsync(_databaseName);
        ContainerResponse containerResponse = await database.Database.CreateContainerIfNotExistsAsync(_userProfileContainerName, "/id");
        return containerResponse.Container;
    }
}
