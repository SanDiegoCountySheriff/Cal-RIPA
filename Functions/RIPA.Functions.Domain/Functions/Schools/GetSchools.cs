using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Schools.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Schools
{
    public class GetSchools
    {
        [FunctionName("GetSchools")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Schools", Connection = "RipaStorage")] CloudTable schools, ILogger log)
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
