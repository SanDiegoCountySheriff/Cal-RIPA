using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;

namespace RIPA.Functions.Cities.Functions
{
    public class GetCities
    {
        public class City : TableEntity
        {
            public string Name { get; set; }
        }

        [FunctionName("GetCities")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Cities", Connection = "AzureWebJobsStorage")] IQueryable<City> cities, ILogger log)
        {
            return new OkObjectResult(cities);
        }
    }
}
