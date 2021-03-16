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
        }
    }
}
