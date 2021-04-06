using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Stop.Services.CosmosDb.Contracts;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions
{
    public class GetStops
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public GetStops(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("GetStops")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("GET - Get Stops requested");

            var response = await _stopCosmosDbService.GetStopsAsync("SELECT * FROM c");

            return new OkObjectResult(response);
        }
    }
}

