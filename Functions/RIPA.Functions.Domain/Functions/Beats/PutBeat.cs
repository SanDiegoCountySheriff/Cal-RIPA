using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.TableStorage.Functions.Beats.Models;
using System;
using System.Threading.Tasks;

namespace RIPA.Functions.TableStorage.Functions.Beats
{
    public static class PutBeat
    {
        [FunctionName("PutBeat")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutBeat/{Id}")] Beat beat, int Id,
            [Table("Beats", Connection = "RipaStorage")] CloudTable beats, ILogger log)

        {
            try
            {
                beat.PartitionKey = "CA";
                beat.RowKey = Id.ToString();
                beat.Id = Id;
                beat.ETag = "*";
                TableOperation createOperation = TableOperation.InsertOrReplace(beat);
                TableResult result = await beats.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("beat failed on insert or replace");
            }
        }
    }
}

