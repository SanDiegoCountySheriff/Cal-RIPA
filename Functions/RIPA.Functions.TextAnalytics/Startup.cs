using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics.Contracts;
using System;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(RIPA.Functions.TextAnalytics.Startup))]

namespace RIPA.Functions.TextAnalytics
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IPiiTextAnalyticsService>(InitializeTextAnaylityicsClientInstanceAsync().GetAwaiter().GetResult());
        }
        private static async Task<PiiTextAnalyticsService> InitializeTextAnaylityicsClientInstanceAsync()
        {
            PiiTextAnalyticsService piiTextAnalytics = new PiiTextAnalyticsService();
            return piiTextAnalytics;
        }
    }
}