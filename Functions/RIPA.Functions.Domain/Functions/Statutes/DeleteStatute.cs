using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using RIPA.Functions.TableStorage.Functions.Statutes.Models;

namespace RIPA.Functions.TableStorage.Functions.Statutes
{
    public class DeleteStatute
    {
        [FunctionName("DeleteStatute")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteStatute/{Id}")] HttpRequest req, int Id,            
            [Table("Statutes", Connection = "RipaStorage")] CloudTable statutes, ILogger log)
        {
            try
            {
                Statute statute = new Statute { PartitionKey = "CA", RowKey = Id.ToString(), OffenseCode = Id, ETag = "*" };
                TableOperation deleteOperation = TableOperation.Delete(statute);
                TableResult result = await statutes.ExecuteAsync(deleteOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Statute Offense Code not found");
            }
        }
    }
}

