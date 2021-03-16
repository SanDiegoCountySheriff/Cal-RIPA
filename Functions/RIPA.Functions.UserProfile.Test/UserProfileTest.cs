using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Logging.Abstractions.Internal;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using RIPA.Functions.UserProfile.Functions;
using RIPA.Functions.UserProfile.Services.CosmosDb.Contracts;
using System;
using System.Collections.Generic;

namespace RIPA.Functions.UserProfile.Test
{
    [TestClass]
    public class UserProfileTest
    {
        private readonly Services.CosmosDb.Models.UserProfile testProfile = new Services.CosmosDb.Models.UserProfile
        {
            FirstName = "Test_First",
            LastName = "Test_Last",
            StartDate = new System.DateTime(year: 2021, month: 01, day: 01)
        };

        private readonly string testId = "Test_Id";
        private readonly ILogger logger = CreateLogger();

        public static ILogger CreateLogger(LoggerTypes type = LoggerTypes.Null)
        {
            ILogger logger;

            if (type == LoggerTypes.List)
            {
                logger = new ListLogger();
            }
            else
            {
                logger = NullLoggerFactory.Instance.CreateLogger("Null Logger");
            }

            return logger;
        }

        public enum LoggerTypes
        {
            Null,
            List
        }
        public class ListLogger : ILogger
        {
            public IList<string> Logs;

            public IDisposable BeginScope<TState>(TState state) => NullScope.Instance;

            public bool IsEnabled(LogLevel logLevel) => false;

            public ListLogger()
            {
                this.Logs = new List<string>();
            }

            public void Log<TState>(LogLevel logLevel,
                                    EventId eventId,
                                    TState state,
                                    Exception exception,
                                    Func<TState, Exception, string> formatter)
            {
                string message = formatter(state, exception);
                this.Logs.Add(message);
            }
        }

        Mock<IUserProfileCosmosDbService> _userProfileCosmosDbService;





        [TestMethod]
        public void CreateUserProfile()
        {
            //var response = await PutUser.Run(testProfile, testId, logger);
            //Assert.Fail();
        }
    }
}
