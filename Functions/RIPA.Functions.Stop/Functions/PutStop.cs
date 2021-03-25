using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;

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
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutStop/{stopId}")] Services.CosmosDb.Models.Stop Stop, string stopId, ILogger log)
        {
            log.LogInformation("PUT - Put Stop requested");

            if (!string.IsNullOrEmpty(Stop.StopText))
            {
                Stop.Id = stopId;
                await _stopCosmosDbService.UpdateStopAsync(stopId, Stop);
                return new OkObjectResult("Put Stop");
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}

