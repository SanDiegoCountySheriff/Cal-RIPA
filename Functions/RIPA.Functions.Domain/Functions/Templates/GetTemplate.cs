using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using RIPA.Functions.TableStorage.Functions.Templates.Models;

namespace RIPA.Functions.TableStorage.Functions.Templates
{
    public static class GetTemplate
    {
        [FunctionName("GetTemplate")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetTemplate/{Id}")] HttpRequest req, string Id,
            [Table("Templates", Connection = "RipaStorage")] CloudTable templates, ILogger log)
        {

            try
            {
                TableOperation getOperation = TableOperation.Retrieve<Template>(partitionKey: "CA", rowkey: Id);
                TableResult result = await templates.ExecuteAsync(getOperation);
                if (result.Result == null) { throw new Exception("Template not found"); }
                return new OkObjectResult((Template)result.Result);
            }
            catch
            {
                return new BadRequestObjectResult("Template not found");
            }
        }
    }
}

