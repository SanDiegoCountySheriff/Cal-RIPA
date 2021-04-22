using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Templates.Services.CosmosDb.Contracts;
using System.Threading.Tasks;


namespace RIPA.Functions.Templates.Functions
{
    public class GetTemplate
    {
        private readonly ITemplateCosmosDbService _templateCosmosDbService;

        public GetTemplate(ITemplateCosmosDbService templateCosmosDbService)
        {
            _templateCosmosDbService = templateCosmosDbService;
        }

        [FunctionName("GetTemplate")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetTemplate/{templateId}")] HttpRequest req, string templateId, ILogger log)
        {
            log.LogInformation("GET - Get Template requested");

            if (!string.IsNullOrEmpty(templateId))
            {
                var response = await _templateCosmosDbService.GetTemplateAsync(templateId);
                if (response != null)
                {
                    return new OkObjectResult(response);
                }
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}
