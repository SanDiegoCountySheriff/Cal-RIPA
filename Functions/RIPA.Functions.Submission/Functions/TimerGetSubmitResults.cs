using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace RIPA.Functions.Submission.Functions
{
    public static class TimerGetSubmitResults
    {
        [FunctionName("TimerGetSubmitResults")]
        public static void Run([TimerTrigger("0 30 9 * * *")]TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"Timer trigger runs each day at 9:30AM: {DateTime.Now}");
            //TODO SFTP download all the results and delete them
            //TODO foreach result, update the records DojSubmit ojbect 
            //Update the submission Object

        }
    }
}
