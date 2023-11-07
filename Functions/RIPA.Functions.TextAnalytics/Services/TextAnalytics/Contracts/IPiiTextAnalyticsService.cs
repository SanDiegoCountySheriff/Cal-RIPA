using Azure.AI.TextAnalytics;
using System.Threading.Tasks;

namespace RIPA.Functions.TextAnalytics.Services.TextAnalytics.Contracts;

public interface IPiiTextAnalyticsService
{
    Task<CategorizedEntityCollection> GetCategorizedEntities(string document);
    Task<PiiEntityCollection> GetPiiEntities(string document);
}
