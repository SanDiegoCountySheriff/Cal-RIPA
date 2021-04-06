using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using RIPA.Functions.TableStorage.Functions.Schools.Models;
using System;

namespace RIPA.Functions.Cities.Functions.Cities
{
    public class PostSchool
    {
        [FunctionName("PostSchool")]
        [return: Table("Schools")]
        public static School Run(
            [HttpTrigger(AuthorizationLevel.Function, "Post", Route = null)] School school, ILogger log)
        {
            return new School { Name = school.Name, RowKey = school.Name, PartitionKey = "CA" };
        }
    }
}
