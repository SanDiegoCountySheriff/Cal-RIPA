using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;
using System.Threading.Tasks;


namespace RIPA.Functions.Stop.Functions
{
    public class PutStop
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public PutStop(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("PutStop")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutStop/{Id}")] Services.CosmosDb.Models.Stop stop, string Id, ILogger log)
        {
            log.LogInformation("PUT - Put Stop requested");

            if (!string.IsNullOrEmpty(Id))
            {
                stop.ori = Id;
                await _stopCosmosDbService.UpdateStopAsync(Id, stop);
                return new OkObjectResult(stop);
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}

