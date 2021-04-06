using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Cities.Models;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Cities
{
    public class PutCity
    {
        [FunctionName("PutCity")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutCity/{Id}")] City city, string Id,
            [Table("Cities", Connection = "RipaStorage")] CloudTable cities, ILogger log)
        {
            try
            {
                city.PartitionKey = "CA";
                city.RowKey = Id;
                city.Name = Id;
                city.ETag = "*";
                city.State = "CA";
                TableOperation createOperation = TableOperation.InsertOrReplace(city);
                TableResult result = await cities.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("City failed on insert or replace");
            }
        }
    }
}
