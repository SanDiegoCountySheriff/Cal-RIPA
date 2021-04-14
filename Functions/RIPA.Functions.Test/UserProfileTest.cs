using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;

namespace RIPA.Functions.Test
{
    [TestClass]
    public class UserProfileTest
    {
        private readonly UserProfile.Services.CosmosDb.Models.UserProfile testProfile = new UserProfile.Services.CosmosDb.Models.UserProfile
        {
            FirstName = "Test_First",
            LastName = "Test_Last",
            StartDate = new System.DateTime(year: 2021, month: 01, day: 01)
        };

        private readonly string testId = "Test_Id";
        private readonly ILogger logger = TestFactory.CreateLogger();

        Mock<IUserProfileCosmosDbService> _userProfileCosmosDbService;

        [TestMethod]
        public void CreateUserProfile()
        {
            //var function = new PutUser((IUserProfileCosmosDbService)_userProfileCosmosDbService);
            //var response = function.Run(testProfile, testId, logger);
            //Assert.IsTrue(0==0);
        }
    }
}
