using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Primitives;
using Moq;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb;
using RIPA.Functions.Stop.Functions;
using RIPA.Functions.Submission.Services.REST;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace RIPA.Functions.Tests
{
    public class UnitTest1
    {
        private readonly ILogger logger = NullLoggerFactory.Instance.CreateLogger("Test");
        private readonly Mock<StopCosmosDbService> mockStopCosmosDbService;
        private readonly Mock<CosmosClient> mockCosmosClient;
        private readonly ITestOutputHelper output;

        public UnitTest1(ITestOutputHelper output)
        {
            this.output = output;
            mockCosmosClient = new Mock<CosmosClient>();
            mockStopCosmosDbService = new Mock<StopCosmosDbService>(mockCosmosClient.Object, "test", "test");
        }

        [Fact]
        public async Task Test1()
        {
            var instance = new GetStop(mockStopCosmosDbService.Object);
            var request = GenerateHttpRequest("Jake");
            var response = await instance.Run(request, "0", logger);

            output.WriteLine(response.ToString());
        }

        private DefaultHttpRequest GenerateHttpRequest(object obj)
        {
            var request = new DefaultHttpRequest(new DefaultHttpContext());
            var queryParams = new Dictionary<string, StringValues>() { { "number", obj.ToString() } };
            request.Query = new QueryCollection(queryParams);
            return request;
        }

        [Fact]
        public void Test2()
        {
            var stopService = new StopService();
            var stop = CreateDefaultStop();

            stopService.CastToDojStop(stop);
        }

        private Common.Models.Stop CreateDefaultStop()
        {
            return new Common.Models.Stop()
            {
                Id = "1",
                Ori = "001",
                Agency = "Agency",
                OfficerId = "1",
                OfficerName = "Officer Name",
                ExpYears = "1",
                OfficerAssignment = new OfficerAssignment()
                {
                    Key = "1",
                    Type = "10",
                    OtherType = "Other Type",
                },
                Date = "2021, 01, 01",
                Time = "12:00PM",
                Location = new Location()
                {
                    ToggleLocationOptions = false,
                    BlockNumber = "1000",
                    StreetName = "AnyStreet St.",
                    City = new City()
                    {
                        Codes = new Codes()
                        {
                            Code = "1",
                            Text = "City",
                        }
                    },
                    School = false,
                    OutOfCounty = false,
                    PiiFound = false,
                    GeoLocation = new GeoLocation()
                    {
                        Latitude = 1,
                        Longitude = 1
                    }
                },
                StopDuration = 10,
                StopInResponseToCFS = false,
                ListPersonStopped = new PersonStopped[] {
                    new PersonStopped() { }
                },
                ListSubmission = new Common.Models.Submission[]
                {
                    new Common.Models.Submission() { }
                },
                Status = "Active",
                IsPiiFound = false,
                PiiEntities = new PiiEntity[]
                {
                    new PiiEntity() { }
                },
                OverridePii = false,
                EditStopExplanation = "EditStopExplanation",
                IsEdited = false,
                Telemetry = new Telemetry()
                {

                },
                ListAgencyQuestion = new AgencyQuestion[]
                {
                    new AgencyQuestion() { }
                }
            };
        }
    }
}
