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
<<<<<<< HEAD
            log.LogInformation("POST - Create Template requested");
=======
            log.LogInformation("PUT - Put Template requested");
>>>>>>> a6cfb94b61ce83075759238ce05ecf400069d700

            if (!string.IsNullOrEmpty(template.TemplateText))
            {
                template.Id = templateId;
                await _templateCosmosDbService.UpdateTemplateAsync(templateId, template);
<<<<<<< HEAD
                return new OkObjectResult("Created Template");
=======
                return new OkObjectResult("Put Template");
>>>>>>> a6cfb94b61ce83075759238ce05ecf400069d700
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}
