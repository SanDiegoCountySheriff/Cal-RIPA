using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Beats.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Beats
{
    public static class GetBeats
    {
        [FunctionName("GetBeats")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Beats", Connection = "RipaStorage")] CloudTable beats, ILogger log)
        {
            List<Beat> response = new List<Beat>();

            foreach (Beat entity in await beats.ExecuteQuerySegmentedAsync(new TableQuery<Beat>(), null))
            {
                response.Add(entity);
            }

            return new OkObjectResult(response);
        }
    }
}

