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
<<<<<<< HEAD
            log.LogInformation("POST - Create Statute requested");
=======
            log.LogInformation("PUT - Put Statute requested");
>>>>>>> a6cfb94b61ce83075759238ce05ecf400069d700

            if (!string.IsNullOrEmpty(Statute.StatuteText))
            {
                Statute.Id = StatuteId;
                await _statuteCosmosDbService.UpdateStatuteAsync(StatuteId, Statute);
<<<<<<< HEAD
                return new OkObjectResult("Created Statute");
=======
                return new OkObjectResult("Put Statute");
>>>>>>> a6cfb94b61ce83075759238ce05ecf400069d700
            }

            return new BadRequestObjectResult("Bad Request");
        }
    }
}
