using Azure;
using Azure.AI.TextAnalytics;
using Microsoft.Extensions.Logging;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics.Contracts;
using System;
using System.Threading.Tasks;

namespace RIPA.Functions.TextAnalytics.Services.TextAnalytics
{
    public class PiiTextAnalyticsService : IPiiTextAnalyticsService
    {
        private readonly ILogger<PiiTextAnalyticsService> _logger;
        private readonly TextAnalyticsClient _textAnalyticsClient;

        public PiiTextAnalyticsService(ILogger<PiiTextAnalyticsService> logger)
        {
            _logger = logger;
            _textAnalyticsClient = new TextAnalyticsClient(new Uri(Environment.GetEnvironmentVariable("TextAnalyticsEndpoint")), new AzureKeyCredential(Environment.GetEnvironmentVariable("TextAnalyticsKey")));
        }

        public async Task<CategorizedEntityCollection> GetCategorizedEntities(string document)
        {
            return await _textAnalyticsClient.RecognizeEntitiesAsync(document);
        }

        public async Task<PiiEntityCollection> GetPiiEntities(string document)
        {
            return await _textAnalyticsClient.RecognizePiiEntitiesAsync(document);
        }
    }
}
