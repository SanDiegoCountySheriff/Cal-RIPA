using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Schools.Models;
using System;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Schools
{
    public class PutSchool
    {
        [FunctionName("PutSchool")]

        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Put", Route = "PutSchool/{Id}")] School school, string Id,
            [Table("Schools", Connection = "RipaStorage")] CloudTable schools, ILogger log)
        {
            try
            {
                if (school.CDSCode == 0 )
                {
                    throw new Exception("CDS CODE Must be Integer and is required");
                }
                school.PartitionKey = "CA";
                school.RowKey = Id;
                school.Name = Id;
                school.ETag = "*";
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
