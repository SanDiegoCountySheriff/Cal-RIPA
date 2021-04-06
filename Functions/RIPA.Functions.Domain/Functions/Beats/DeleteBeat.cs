using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using RIPA.Functions.TableStorage.Functions.Beats.Models;
using System.IO;
using System.Threading.Tasks;

namespace RIPA.Functions.TableStorage.Functions.Beats
{
    public static class DeleteBeat
    {
        [FunctionName("DeleteBeat")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteBeat/{Id}")] HttpRequest req, int Id,
            [Table("Beats", Connection = "RipaStorage")] CloudTable beats, ILogger log)
        {
            try
            {
                Beat beat= new Beat{ PartitionKey = "CA", RowKey = Id.ToString(), Id = Id, ETag = "*" };
                TableOperation deleteOperation = TableOperation.Delete(beat);
                TableResult result = await beats.ExecuteAsync(deleteOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Beat Id not found");
            }
        }
    }
}

