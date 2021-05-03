using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Submission.Services.REST;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Net.Http;

[assembly: FunctionsStartup(typeof(RIPA.Functions.Submission.Startup))]

namespace RIPA.Functions.Submission
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IStopService>(InitializeStopService());
            builder.Services.AddSingleton<ISftpService>(InitializeSftpService());
        }

        private static StopService InitializeStopService()
        {
            return new StopService(new HttpClient(), Environment.GetEnvironmentVariable("GetStopUrl"), Environment.GetEnvironmentVariable("PutStopUrl"));
        }

        private static SftpService InitializeSftpService()
        {
            SftpConfig sftpConfig = new SftpConfig
            {
                Host = Environment.GetEnvironmentVariable("SftpHost"),
                Port = Convert.ToInt32(Environment.GetEnvironmentVariable("SftpPort")),
                UserName = Environment.GetEnvironmentVariable("SftpUserName"),
                Password = Environment.GetEnvironmentVariable("SftpPassword")
            };
            LoggerFactory loggerFactory = new LoggerFactory();
            return new SftpService(loggerFactory.CreateLogger(typeof(SftpService)), sftpConfig);

        }
    }
}
