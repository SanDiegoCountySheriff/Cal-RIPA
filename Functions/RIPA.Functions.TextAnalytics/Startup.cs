using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics.Contracts;
using System.Threading.Tasks;

[assembly: FunctionsStartup(typeof(RIPA.Functions.TextAnalytics.Startup))]

namespace RIPA.Functions.TextAnalytics
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IPiiTextAnalyticsService>(InitializeTextAnaylityicsClientInstanceAsync());
        }
        private static PiiTextAnalyticsService InitializeTextAnaylityicsClientInstanceAsync()
        {
            PiiTextAnalyticsService piiTextAnalytics = new PiiTextAnalyticsService();
            return piiTextAnalytics;
        }
    }
}