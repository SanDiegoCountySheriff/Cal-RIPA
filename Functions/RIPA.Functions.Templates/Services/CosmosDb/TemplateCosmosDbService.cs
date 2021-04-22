using Microsoft.Azure.Cosmos;
using RIPA.Functions.Templates.Services.CosmosDb.Contracts;
using RIPA.Functions.Templates.Services.CosmosDb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Templates.Services.CosmosDb
{
    public class TemplateCosmosDbService : ITemplateCosmosDbService
    {
        private readonly Container _container;

        public TemplateCosmosDbService(CosmosClient dbClient, string databaseName, string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddTemplateAsync(Template template)
        {
            await _container.CreateItemAsync<Models.Template>(template, new PartitionKey(template.Id));
        }

        public async Task DeleteTemplateAsync(string id)
        {
            await _container.DeleteItemAsync<Models.Template>(id, new PartitionKey(id));
        }

        public async Task<Template> GetTemplateAsync(string id)
        {
            try
            {
                ItemResponse<Models.Template> response = await _container.ReadItemAsync<Models.Template>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<Template>> GetTemplatesAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<Models.Template>(new QueryDefinition(queryString));
            List<Models.Template> results = new List<Models.Template>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateTemplateAsync(string id, Template template)
        {
            await _container.UpsertItemAsync<Models.Template>(template, new PartitionKey(id));
        }
    }
}
