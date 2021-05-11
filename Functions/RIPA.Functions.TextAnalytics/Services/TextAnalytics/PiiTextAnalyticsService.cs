using Azure;
using Azure.AI.TextAnalytics;
using RIPA.Functions.TextAnalytics.Services.TextAnalytics.Contracts;
using System;
using System.Threading.Tasks;

namespace RIPA.Functions.TextAnalytics.Services.TextAnalytics
{
    public class PiiTextAnalyticsService : IPiiTextAnalyticsService
    {
        private readonly TextAnalyticsClient _textAnalyticsClient;

        public PiiTextAnalyticsService()
        {
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
