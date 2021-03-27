using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Templates.Services.CosmosDb.Contracts;
using System.Threading.Tasks;

namespace RIPA.Functions.Templates.Functions
{
    public class PutTemplate
    {
        private readonly ITemplateCosmosDbService _templateCosmosDbService;

        public PutTemplate(ITemplateCosmosDbService templateCosmosDbService)
        {
            _templateCosmosDbService = templateCosmosDbService;
        }

        [FunctionName("PutTemplate")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutTemplate/{templateId}")] Services.CosmosDb.Models.Template template, string templateId, ILogger log)
        {
            log.LogInformation("PUT - Put Template requested");

            if (!string.IsNullOrEmpty(template.TemplateText))
            {
                template.Id = templateId;
                await _templateCosmosDbService.UpdateTemplateAsync(templateId, template);
                return new OkObjectResult(template);
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}
