using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Templates.Models;
using System;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Templates
{
    public static class PutTemplate
    {
        [FunctionName("PutTemplate")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutTemplate/{Id}")] Template template, string Id,
            [Table("Templates", Connection = "RipaStorage")] CloudTable templates, ILogger log)
        {
            try
            {
                if (String.IsNullOrEmpty(Id))
                {
                    throw new Exception("template id is required");
                }
                template.PartitionKey = "CA";
                template.RowKey = Id;
                template.ETag = "*";
                TableOperation createOperation = TableOperation.InsertOrReplace(template);
                TableResult result = await templates.ExecuteAsync(createOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Template failed on insert or replace");
            }
        }
    }
}

