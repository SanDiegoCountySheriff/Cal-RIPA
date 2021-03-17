using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.TableStorage.Functions.Schools.Models;
using System.Threading.Tasks;

namespace RIPA.Functions.TableStorage.Functions.Schools
{
    public class PutSchool
    {
        [FunctionName("PutSchool")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutSchool/{Id}")] HttpRequest req, string Id,
            [Table("Schools", Connection = "AzureWebJobsStorage")] CloudTable schools, ILogger log)
        {
            try
            {
                School school = new School { PartitionKey = "CA", RowKey = Id, Name = Id, ETag = "*" };
                TableOperation createOperation = TableOperation.InsertOrReplace(school);
                TableResult result = await schools.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("School failed on insert or replace");
            }
        }
    }
}
