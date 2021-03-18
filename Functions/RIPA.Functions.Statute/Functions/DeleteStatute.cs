using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Statute.Services.CosmosDb.Contracts;
using System.Threading.Tasks;
namespace RIPA.Functions.Statute.Functions
{
    public class DeleteStatute
    {
        private readonly IStatuteCosmosDbService _statuteCosmosDbService;

        public DeleteStatute(IStatuteCosmosDbService statuteCosmosDbService)
        {
            _statuteCosmosDbService = statuteCosmosDbService;
        }

        [FunctionName("DeleteStatute")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteStatute/{statuteId}")] HttpRequest req, string statuteId, ILogger log)
        {
            log.LogInformation("Delete - Delete Statute requested");

            if (!string.IsNullOrEmpty(statuteId))
            {
                await _statuteCosmosDbService.DeleteStatuteAsync(statuteId);
                return new OkObjectResult($"Deleted {statuteId}");
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}
