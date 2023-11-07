using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics.Contracts;

[assembly: FunctionsStartup(typeof(RIPA.Functions.TextAnalytics.Startup))]

namespace RIPA.Functions.TextAnalytics;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddLogging();
        builder.Services.AddSingleton<IPiiTextAnalyticsService, PiiTextAnalyticsService>();
    }
}
