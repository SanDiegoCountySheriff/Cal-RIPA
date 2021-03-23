using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Logging.Abstractions.Internal;
using System;
using System.Collections.Generic;
using System.Text;

namespace RIPA.Functions.Test
{
    public class TestFactory
    {
        public static HttpRequest CreateHttpRequest()
        {
            var context = new DefaultHttpContext();
            var request = context.Request;
            return request;
        }

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
    }
}
