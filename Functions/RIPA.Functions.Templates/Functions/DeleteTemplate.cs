using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Templates.Services.CosmosDb.Contracts;
using System.Threading.Tasks;

namespace RIPA.Functions.Templates.Functions
{
    public class DeleteTemplate
    {
        private readonly ITemplateCosmosDbService _templateCosmosDbService;

        public DeleteTemplate(ITemplateCosmosDbService templateCosmosDbService)
        {
            _templateCosmosDbService = templateCosmosDbService;
        }

        [FunctionName("DeleteTemplate")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteTemplate/{templateId}")] HttpRequest req, string templateId, ILogger log)
        {
            log.LogInformation("Delete - Delete Template requested");

            if (!string.IsNullOrEmpty(templateId))
            {
                await _templateCosmosDbService.DeleteTemplateAsync(templateId);
                return new OkObjectResult($"Deleted {templateId}");
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}

