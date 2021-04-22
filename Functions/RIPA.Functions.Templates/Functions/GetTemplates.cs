using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Templates.Services.CosmosDb.Contracts;
using System.Threading.Tasks;

namespace RIPA.Functions.Templates.Functions
{
    public class GetTemplates
    {
        private readonly ITemplateCosmosDbService _templateCosmosDbService;

        public GetTemplates(ITemplateCosmosDbService templateCosmosDbService)
        {
            _templateCosmosDbService = templateCosmosDbService;
        }

        [FunctionName("GetTemplates")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("GET - Get templates requested");

            var response = await _templateCosmosDbService.GetTemplateAsync("SELECT * FROM c");

            return new OkObjectResult(response);
        }
    }
}

