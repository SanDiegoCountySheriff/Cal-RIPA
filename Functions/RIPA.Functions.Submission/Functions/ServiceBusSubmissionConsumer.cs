using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace RIPA.Functions.Submission.Functions
{
    public static class ServiceBusSubmissionConsumer
    {
        [FunctionName("ServiceBusSubmissionConsumer")]
        public static void Run([ServiceBusTrigger("submission", Connection = "ServiceBusConnection")]string myQueueItem, ILogger log)
        {
            log.LogInformation($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
        }
    }
}
