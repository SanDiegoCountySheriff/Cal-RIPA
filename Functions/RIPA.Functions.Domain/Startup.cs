using System;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(RIPA.Functions.Domain.Startup))]

namespace RIPA.Functions.Domain
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddLogging();
            builder.Services.AddSingleton<CloudTableClient>(InitializeCloudTableClient().GetAwaiter().GetResult());
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        }

        private static async Task<CloudTableClient> InitializeCloudTableClient()
        {
            var account = CloudStorageAccount.Parse(Environment.GetEnvironmentVariable("RipaStorage"));
            var client = account.CreateCloudTableClient();
            await client.GetTableReference("Beats").CreateIfNotExistsAsync();
            await client.GetTableReference("Schools").CreateIfNotExistsAsync();
            await client.GetTableReference("Cities").CreateIfNotExistsAsync();
            await client.GetTableReference("Statutes").CreateIfNotExistsAsync();

            return client;
        }
    }
}
