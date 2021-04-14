using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using RIPA.Functions.Domain.Functions.Statutes.Models;

namespace RIPA.Functions.Domain.Functions.Statutes
{
    public static class PutStatute
    {
        [FunctionName("PutStatute")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutStatute/{Id}")] Statute statute, int Id,
             [Table("Statutes", Connection = "RipaStorage")] CloudTable statutes, ILogger log)
        {
            try
            {
                if (statute.OffenseCode == 0 )
                {
                    throw new Exception("Offense Code Must be type Integer and is required");
                }
                statute.PartitionKey = "CA";
                statute.RowKey = Id.ToString();
                statute.OffenseCode = Id;
                statute.ETag = "*";
                TableOperation createOperation = TableOperation.InsertOrReplace(statute);
                TableResult result = await statutes.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Statute failed on insert or replace");
            }
        }
    }
}

