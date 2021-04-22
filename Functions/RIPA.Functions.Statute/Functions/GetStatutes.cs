using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Statute.Services.CosmosDb.Contracts;
using System.Threading.Tasks;


namespace RIPA.Functions.Statute.Functions
{
    public class GetStatutes
    {
        private readonly IStatuteCosmosDbService _statuteCosmosDbService;

        public GetStatutes(IStatuteCosmosDbService statuteCosmosDbService)
        {
            _statuteCosmosDbService = statuteCosmosDbService;
        }

        [FunctionName("GetStatutes")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("GET - Get Statutes requested");

            var response = await _statuteCosmosDbService.GetStatutesAsync("SELECT * FROM c");

            return new OkObjectResult(response);
        }
    }
}
