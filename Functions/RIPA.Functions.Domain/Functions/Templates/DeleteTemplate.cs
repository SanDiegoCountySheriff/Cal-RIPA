using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Templates.Models;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Templates
{
    public static class DeleteTemplate
    {
        [FunctionName("DeleteTemplate")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "DeleteTemplate/{Id}")] HttpRequest req, string Id,
            [Table("Templates", Connection = "RipaStorage")] CloudTable templates, ILogger log)
        {
            try
            {
                Template template = new Template { PartitionKey = "CA", RowKey = Id, ETag = "*" };
                TableOperation deleteOperation = TableOperation.Delete(template);
                TableResult result = await templates.ExecuteAsync(deleteOperation);

                return new OkObjectResult(result);
            }
            catch
            {
                return new BadRequestObjectResult("Template not found");
            }
        }
    }
}

