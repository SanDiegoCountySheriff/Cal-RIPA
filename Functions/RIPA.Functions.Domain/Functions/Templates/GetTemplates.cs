using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.TableStorage.Functions.Templates.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.TableStorage.Functions.Templates
{
    public static class GetTemplates
    {
        [FunctionName("GetTemplates")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Templates", Connection = "RipaStorage")] CloudTable templates, ILogger log)

        {
            List<Template> response = new List<Template>();

            foreach (Template entity in await templates.ExecuteQuerySegmentedAsync(new TableQuery<Template>(), null))
            {
                response.Add(entity);
            }

            return new OkObjectResult(response);
        }
    }
}

