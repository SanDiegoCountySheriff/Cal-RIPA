using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.TableStorage.Functions.Cities.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

<<<<<<< HEAD:Functions/RIPA.Functions.TableStorage/Functions/Cities/GetCities.cs
namespace RIPA.Functions.Cities.Functions.Cities
=======
namespace RIPA.Functions.TableStorage.Functions.Cities
>>>>>>> 3664cb26726da6227ef3554e11fb77e2e5beb91f:Functions/RIPA.Functions.TableStorage/Functions/GetCities.cs
{
    public class GetCities
    {
        [FunctionName("GetCities")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [Table("Cities", Connection = "RipaStorage")] CloudTable cities, ILogger log)
        {
            List<City> response = new List<City>();

            foreach (City entity in await cities.ExecuteQuerySegmentedAsync(new TableQuery<City>(), null))
            {
                response.Add(entity);
            }

            return new OkObjectResult(response);

        }
    }
}
