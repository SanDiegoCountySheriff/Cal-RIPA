using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Primitives;
using Moq;
using RIPA.Functions.Common.Services.Stop.CosmosDb;
using RIPA.Functions.Stop.Functions;
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
    }
}
