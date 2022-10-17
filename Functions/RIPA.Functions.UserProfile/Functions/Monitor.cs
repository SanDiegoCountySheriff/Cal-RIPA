using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using System;

namespace RIPA.Functions.UserProfile.Functions
{
    public class Monitor
    {
        [FunctionName("Monitor")]
        public void Run([TimerTrigger("0 */10 * * * *")] TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
        }
    }
}
