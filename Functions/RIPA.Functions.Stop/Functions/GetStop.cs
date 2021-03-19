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
    public class GetStop
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;

        public GetStop(IStopCosmosDbService stopCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
        }

        [FunctionName("GetStop")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetStop/{stopId}")] HttpRequest req, string stopId, ILogger log)
        {
            log.LogInformation("GET - Get Stop requested");

            if (!string.IsNullOrEmpty(stopId))
            {
                var response = await _stopCosmosDbService.GetStopAsync(stopId);
                if (response != null)
                {
                    return new OkObjectResult(response);
                }
            }

            return new BadRequestObjectResult("Not found");
        }
    }
}

