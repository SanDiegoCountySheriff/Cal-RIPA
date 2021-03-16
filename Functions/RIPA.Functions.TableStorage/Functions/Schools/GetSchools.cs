using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Cities.Functions.Schools
{
    public class GetSchools
    {
        public class School : TableEntity
        {
            public string Name { get; set; }
        }

        [FunctionName("GetSchools")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Schools", Connection = "AzureWebJobsStorage")] CloudTable schools, ILogger log)
        {
            List<School> response = new List<School>();

            foreach (School entity in await schools.ExecuteQuerySegmentedAsync(new TableQuery<School>(), null))
            {
                response.Add(entity);
            }

            return new OkObjectResult(response);
        }
    }
}
