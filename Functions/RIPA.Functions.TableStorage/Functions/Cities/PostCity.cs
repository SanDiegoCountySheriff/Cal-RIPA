<<<<<<< HEAD
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.TableStorage.Functions.Cities.Models;
using System;

namespace RIPA.Functions.Cities.Functions.Cities
{
    public class PostCity
    {
        [FunctionName("PostCity")]
        [return: Table("Cities")]
        public static City Run(
            [HttpTrigger(AuthorizationLevel.Function, "Post", Route = null)] City city, ILogger log)
        {
            return new City { Name = city.Name, RowKey = city.Name, PartitionKey = "CA" };
=======
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
    public class PutCity
    {
        [FunctionName("PutCity")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutCity/{Id}")] HttpRequest req, string Id,
            [Table("Cities", Connection = "AzureWebJobsStorage")] CloudTable cities, ILogger log)
        {
            try
            {
                City city = new City { PartitionKey = "CA", RowKey = Id, Name = Id, ETag = "*" };
                TableOperation createOperation = TableOperation.InsertOrReplace(city);
                TableResult result = await cities.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("City failed on insert or replace");
            }
>>>>>>> 3664cb26726da6227ef3554e11fb77e2e5beb91f
        }
    }
}
