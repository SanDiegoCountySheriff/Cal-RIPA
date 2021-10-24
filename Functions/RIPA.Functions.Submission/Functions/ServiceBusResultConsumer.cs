using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.ServiceBus.Core;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.REST.Contracts;
using static RIPA.Functions.Submission.Services.ServiceBus.ResultServiceBusService;

namespace RIPA.Functions.Submission.Functions
{
    public class ServiceBusResultConsumer
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly IStopService _stopService;

        public ServiceBusResultConsumer(IStopCosmosDbService stopCosmosDbService, IStopService stopService)
        {
            _stopCosmosDbService = stopCosmosDbService;
            _stopService = stopService;
        }

        // [FunctionName("ServiceBusResultConsumer")]
        // public async void Run(
        //     [ServiceBusTrigger("result", Connection = "ServiceBusConnection")] string myQueueItem, int deliveryCount,
        //     MessageReceiver messageReceiver, string lockToken,
        //     ILogger log)
        // {
        //     log.LogInformation($"C# ServiceBus queue trigger function processed message: {myQueueItem}");

        //     try
        //     {
        //         ResultMessage submissionMessage = JsonConvert.DeserializeObject<ResultMessage>(myQueueItem);
        //         if (submissionMessage.ErrorType == Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.FileLevelFatalError))
        //         {
        //             await ProcessFileLevelFatalErrors(submissionMessage.Error);
        //         }
        //         else
        //         {
        //             await ProcessRecordLevelErrors(submissionMessage.Error, submissionMessage.ErrorType);
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         log.LogError($"Failed to process result error message: {myQueueItem}, {ex}");
        //         await messageReceiver.DeadLetterAsync(lockToken);
        //     }
        //     await messageReceiver.CompleteAsync(lockToken);
        // }

        // public async Task ProcessFileLevelFatalErrors(string fileLevelFatalErrors)
        // {
        //     using StringReader reader = new StringReader(fileLevelFatalErrors);
        //     string line;
        //     while ((line = reader.ReadLine()) != null)
        //     {
        //         var fileLevelFatalError = DeserializeFileLevelFatalError(line);
        //         var stopId = fileLevelFatalError.FileName.Split("_")[2].Replace(".json", string.Empty);
        //         var stop = await _stopCosmosDbService.GetStopAsync(stopId);
        //         SubmissionError submissionError = new SubmissionError
        //         {
        //             DateReported = DateTime.UtcNow,
        //             Code = "FLFE",
        //             ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.FileLevelFatalError),
        //             Message = fileLevelFatalError.ErrorMessage,
        //             FileName = fileLevelFatalError.FileName
        //         };

        //         await _stopCosmosDbService.UpdateStopAsync(_stopService.ErrorSubmission(stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
        //     }
        // }

        // public async Task ProcessRecordLevelErrors(string recordLevelErrors, string type)
        // {
        //     using StringReader reader = new StringReader(recordLevelErrors);
        //     string line;
        //     while ((line = reader.ReadLine()) != null)
        //     {
        //         var recordLevelError = DeserializeRecordLevelError(line);
        //         var stop = await _stopCosmosDbService.GetStopAsync(recordLevelError.LeaRecordId);
        //         SubmissionError submissionError = new SubmissionError
        //         {
        //             DateReported = DateTime.UtcNow,
        //             Code = type == Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError) ? "RLFE" : recordLevelError.ErrorList.Split("::")[0],
        //             ErrorType = type,
        //             Message = type == Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError) ? recordLevelError.ErrorList : recordLevelError.ErrorList.Split("::")[1],
        //             FileName = recordLevelError.FileName
        //         };
        //         await _stopCosmosDbService.UpdateStopAsync(_stopService.ErrorSubmission(stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
        //     }
        // }

        // public static FileLevelFatalError DeserializeFileLevelFatalError(string fileLevelFatalErrorString)
        // {
        //     string[] values = fileLevelFatalErrorString.Split("|");
        //     FileLevelFatalError fileLevelFatalError = new FileLevelFatalError
        //     {
        //         AgencyOri = values[0],
        //         FileName = values[1],
        //         DateSubmitted = values[2],
        //         TimeSubmitted = values[3],
        //         ErrorMessage = values[4].Replace("\"", string.Empty)
        //     };
        //     return fileLevelFatalError;
        // }

        // public class FileLevelFatalError
        // {
        //     public string AgencyOri { get; set; }
        //     public string FileName { get; set; }
        //     public string DateSubmitted { get; set; }
        //     public string TimeSubmitted { get; set; }
        //     public string ErrorMessage { get; set; }
        // }

        // public static RecordLevelError DeserializeRecordLevelError(string recordLevelErrorString)
        // {
        //     string[] values = recordLevelErrorString.Split("|");
        //     RecordLevelError recordLevelError = new RecordLevelError
        //     {
        //         AgencyOri = values[0],
        //         FileName = values[1],
        //         LeaRecordId = values[2],
        //         ErrorList = values[3].Replace("\"", string.Empty)
        //     };
        //     return recordLevelError;
        // }

        // public class RecordLevelError
        // {
        //     public string AgencyOri { get; set; }
        //     public string FileName { get; set; }
        //     public string LeaRecordId { get; set; }
        //     public string ErrorList { get; set; }

        // }


    }
}
