using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using RIPA.Functions.Domain.Functions.Statutes.Models;

namespace RIPA.Functions.Domain.Functions.Statutes
{
    public static class GetStatutes
    {
        [FunctionName("GetStatutes")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Statutes",Connection = "RipaStorage")] CloudTable statutes ,ILogger log)
        {
            List<Statute> response = new List<Statute>();

            foreach (Statute entity in await statutes.ExecuteQuerySegmentedAsync(new TableQuery<Statute>(), null))
            {
                response.Add(entity);
            }

            return new OkObjectResult(response);
        }
    }
}

