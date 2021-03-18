using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Logging.Abstractions.Internal;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Moq;
using Newtonsoft.Json;
using RIPA.Functions.TableStorage.Functions.Cities;
using RIPA.Functions.TableStorage.Functions.Cities.Models;
using RIPA.Functions.TableStorage.Functions.Schools;
using RIPA.Functions.TableStorage.Functions.Schools.Models;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Test
{
    [TestClass]
    public class TableStorageSchoolsTest
    {
        private readonly School school = new School
        {
            Name = "Test",
        };

        private readonly ILogger logger = TestFactory.CreateLogger();

        private readonly CloudTable _schools;

        public TableStorageSchoolsTest()
        {
            _ = JsonConvert.DeserializeObject<Dictionary<string, string>>(System.IO.File.ReadAllText("local.settings.json")).TryGetValue("AzureWebJobsStorage", out string cloudConnString);
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(cloudConnString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            _schools = tableClient.GetTableReference("Schools");
        }

        [TestMethod]
        public async Task PutSchoolTest()
        {
            var response = (OkObjectResult)await PutSchool.Run(TestFactory.CreateHttpRequest(), school.Name, _schools, logger);
            
            Assert.IsTrue(response.StatusCode == 200); 
        }

        [TestMethod]
        public async Task GetSchoolsTest()
        {
<<<<<<< HEAD
=======
            var context = new DefaultHttpContext();
            var request = context.Request;
>>>>>>> dev
            var response = (OkObjectResult)await GetSchools.Run(TestFactory.CreateHttpRequest(), _schools, logger);

            Assert.IsTrue(response.StatusCode == 200);
        }

        [TestMethod]
        public async Task DeleteSchoolTest()
        {
<<<<<<< HEAD
=======
            var context = new DefaultHttpContext();
            var request = context.Request;
>>>>>>> dev
            var response = (OkObjectResult)await DeleteSchool.Run(TestFactory.CreateHttpRequest(), school.Name, _schools, logger);

            Assert.IsTrue(response.StatusCode == 200);
        }
    }
}
