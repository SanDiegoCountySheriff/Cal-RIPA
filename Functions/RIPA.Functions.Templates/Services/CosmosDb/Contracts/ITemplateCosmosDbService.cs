using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Templates.Services.CosmosDb.Contracts
{
    public interface ITemplateCosmosDbService
    {
        Task<IEnumerable<Models.Template>> GetTemplatesAsync(string queryString);
        Task<Models.Template> GetTemplateAsync(string id);
        Task AddTemplateAsync(Models.Template template);
        Task UpdateTemplateAsync(string id, Models.Template template);
        Task DeleteTemplateAsync(string id);

    }
}
