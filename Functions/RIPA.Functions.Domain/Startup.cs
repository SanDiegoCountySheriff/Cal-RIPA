using System;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(RIPA.Functions.Domain.Startup))]

namespace RIPA.Functions.Domain;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddLogging();
        builder.Services.AddSingleton(InitializeCloudTableClient().GetAwaiter().GetResult());
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
    }

    private static async Task<TableServiceClient> InitializeCloudTableClient()
    {
        var tableServiceClient = new TableServiceClient(Environment.GetEnvironmentVariable("RipaStorage"));

        await tableServiceClient.CreateTableIfNotExistsAsync("Beats");
        await tableServiceClient.CreateTableIfNotExistsAsync("Schools");
        await tableServiceClient.CreateTableIfNotExistsAsync("Cities");
        await tableServiceClient.CreateTableIfNotExistsAsync("Statutes");

        return tableServiceClient;
    }
}
