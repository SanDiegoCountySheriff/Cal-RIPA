using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using RIPA.Functions.Domain.Functions.Cities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Test
{
    [TestClass]
    public class TableStorageCitiesTest
    {
        private readonly City city = new City
        {
            Name = "Test",
        };

        private readonly ILogger logger = TestFactory.CreateLogger();

        private readonly CloudTable _cities;

        public TableStorageCitiesTest()
        {
            _ = JsonConvert.DeserializeObject<Dictionary<string, string>>(System.IO.File.ReadAllText("local.settings.json")).TryGetValue("AzureWebJobsStorage", out string cloudConnString);
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(cloudConnString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            _cities = tableClient.GetTableReference("Cities");
        }

        [TestMethod]
        public async Task PutCityTest()
        {
            var response = (OkObjectResult)await PutCity.Run(TestFactory.CreateHttpRequest(), city.Name, _cities, logger);

            Assert.IsTrue(response.StatusCode == 200);
        }

        [TestMethod]
        public async Task GetCitiesTest()
        {
            var response = (OkObjectResult)await GetCities.Run(TestFactory.CreateHttpRequest(), _cities, logger);

            Assert.IsTrue(response.StatusCode == 200);
        }

        [TestMethod]
        public async Task DeleteCityTest()
        {
            var response = (OkObjectResult)await DeleteCity.Run(TestFactory.CreateHttpRequest(), city.Name, _cities, logger);

            Assert.IsTrue(response.StatusCode == 200);
        }
    }
}
