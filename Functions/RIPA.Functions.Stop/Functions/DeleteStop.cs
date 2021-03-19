using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions
{
    public class DeleteStop
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public DeleteStop(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("DeleteStop")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteStop/{stopId}")] HttpRequest req, string stopId, ILogger log)
        {
            log.LogInformation("Delete - Delete Stop requested");

            if (!string.IsNullOrEmpty(stopId))
            {
                await _stopCosmosDbService.DeleteStopAsync(stopId);
                return new OkObjectResult($"Deleted {stopId}");
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}

