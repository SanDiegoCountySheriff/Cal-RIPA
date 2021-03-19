using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Statute.Services.CosmosDb.Contracts;
using System.Threading.Tasks;

namespace RIPA.Functions.Statute.Functions
{
    public class PutStatute
    {
        private readonly IStatuteCosmosDbService _statuteCosmosDbService;

        public PutStatute(IStatuteCosmosDbService statuteCosmosDbService)
        {
            _statuteCosmosDbService = statuteCosmosDbService;
        }

        [FunctionName("PutStatute")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutStatute/{StatuteId}")] Services.CosmosDb.Models.Statute Statute, string StatuteId, ILogger log)
        {
            log.LogInformation("PUT - Put Statute requested");

            if (!string.IsNullOrEmpty(Statute.StatuteText))
            {
                Statute.Id = StatuteId;
                await _statuteCosmosDbService.UpdateStatuteAsync(StatuteId, Statute);
                return new OkObjectResult("Put Statute");
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}
