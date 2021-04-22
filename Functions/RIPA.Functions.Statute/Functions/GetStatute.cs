using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Statute.Services.CosmosDb.Contracts;
using System.Threading.Tasks;

namespace RIPA.Functions.Statute.Functions
{
    public class GetStatute
    {
        private readonly IStatuteCosmosDbService _statuteCosmosDbService;

        public GetStatute(IStatuteCosmosDbService statuteCosmosDbService)
        {
            _statuteCosmosDbService = statuteCosmosDbService;
        }

        [FunctionName("GetStatute")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetStatute/{StatuteId}")] HttpRequest req, string StatuteId, ILogger log)
        {
            log.LogInformation("GET - Get Statute requested");

            if (!string.IsNullOrEmpty(StatuteId))
            {
                var response = await _statuteCosmosDbService.GetStatuteAsync(StatuteId);
                if (response != null)
                {
                    return new OkObjectResult(response);
                }
            }

            return new BadRequestObjectResult("Not found");
        }

    }
}
