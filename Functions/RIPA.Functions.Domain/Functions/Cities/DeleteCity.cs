
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.TableStorage.Functions.Cities.Models;
using System.Threading.Tasks;

namespace RIPA.Functions.TableStorage.Functions.Cities
{
    public class DeleteCity
    {
        [FunctionName("DeleteCity")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteCity/{Id}")] HttpRequest req, string Id,
            [Table("Cities", Connection = "RipaStorage")] CloudTable cities, ILogger log)
        {
            try
            {
                City city = new City { PartitionKey = "CA", RowKey = Id, Name = Id, ETag = "*" };
                TableOperation deleteOperation = TableOperation.Delete(city);
                TableResult result = await cities.ExecuteAsync(deleteOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("City Id not found");
            }

        }
    }
}
