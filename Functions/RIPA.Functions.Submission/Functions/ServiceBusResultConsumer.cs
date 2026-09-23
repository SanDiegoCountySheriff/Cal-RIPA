using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.ServiceBus;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using static RIPA.Functions.Submission.Services.ServiceBus.ResultServiceBusService;

namespace RIPA.Functions.Submission.Functions;

public class ServiceBusResultConsumer
{
    private readonly IStopCosmosDbService<Common.Models.v1.Stop> _stopV1CosmosDbService;
    private readonly IStopCosmosDbService<Common.Models.v2.Stop> _stopV2CosmosDbService;
    private readonly Services.REST.v1.Contracts.IStopService _stopV1Service;
    private readonly Services.REST.v2.Contracts.IStopService _stopV2Service;

    public ServiceBusResultConsumer(
        IStopCosmosDbService<Common.Models.v1.Stop> stopV1CosmosDbService,
        IStopCosmosDbService<Common.Models.v2.Stop> stopV2CosmosDbService,
        Services.REST.v1.Contracts.IStopService stopV1Service,
        Services.REST.v2.Contracts.IStopService stopV2Service
    )
    {
        _stopV1CosmosDbService = stopV1CosmosDbService;
        _stopV2CosmosDbService = stopV2CosmosDbService;
        _stopV1Service = stopV1Service;
        _stopV2Service = stopV2Service;
    }

    [FunctionName("ServiceBusResultConsumer")]
    public async Task Run(
        [ServiceBusTrigger("result", Connection = "ServiceBusConnection")]
        ServiceBusReceivedMessage[] messages,
        ServiceBusMessageActions messageReceiver,
        ILogger log)
    {

        foreach (var message in messages)
        {
            try
            {
                log.LogInformation($"C# ServiceBus queue trigger function processed message: {message.MessageId}");

                ResultMessage submissionMessage = JsonConvert.DeserializeObject<ResultMessage>(message.Body.ToString());

                if (submissionMessage.Errors != null && submissionMessage.Errors.Count > 0)
                {
                    await ProcessStructuredResult(submissionMessage, log);
                }
                else if (submissionMessage.ErrorType == Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.FileLevelFatalError))
                {
                    await ProcessFileLevelFatalErrors(submissionMessage.Error);
                }
                else
                {
                    await ProcessRecordLevelErrors(submissionMessage.Error, submissionMessage.ErrorType);
                }
            }
            catch (Exception ex)
            {
                log.LogError($"Failed to process result error message: {message.MessageId}, {ex}");
                await messageReceiver.DeadLetterMessageAsync(message);
                continue;
            }

            await messageReceiver.CompleteMessageAsync(message);
        }
    }

    public async Task ProcessStructuredResult(ResultMessage resultMessage, ILogger log)
    {
        var stopId = !string.IsNullOrWhiteSpace(resultMessage.LeaRecordId)
            ? resultMessage.LeaRecordId
            : GetStopIdFromFileName(resultMessage.FileName);

        if (string.IsNullOrWhiteSpace(stopId))
        {
            log.LogWarning($"Unable to determine stop id for DOJ result. FileName={resultMessage.FileName}");
            return;
        }

        IStop stop;
        try
        {
            stop = await _stopV1CosmosDbService.GetStopAsync(stopId);

            if (stop.StopVersion == StopVersion.V2)
            {
                stop = await _stopV2CosmosDbService.GetStopAsync(stopId);
            }
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            log.LogWarning($"Stop {stopId} from DOJ result was not found. FileName={resultMessage.FileName}");
            return;
        }

        var failedStatus = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed);

        foreach (var error in resultMessage.Errors)
        {
            var submissionError = new SubmissionError
            {
                DateReported = DateTime.UtcNow,
                Code = error.Code,
                ErrorType = error.ErrorType,
                Message = error.Message,
                FileName = resultMessage.FileName
            };

            if (stop.StopVersion == StopVersion.V2)
            {
                stop = _stopV2Service.ErrorSubmission((Common.Models.v2.Stop)stop, submissionError, failedStatus);
            }
            else
            {
                stop = _stopV1Service.ErrorSubmission((Common.Models.v1.Stop)stop, submissionError, failedStatus);
            }
        }

        if (stop.StopVersion == StopVersion.V2)
        {
            await _stopV2CosmosDbService.UpdateStopAsync((Common.Models.v2.Stop)stop);
        }
        else
        {
            await _stopV1CosmosDbService.UpdateStopAsync((Common.Models.v1.Stop)stop);
        }
    }

    private static string GetStopIdFromFileName(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        var parts = Path.GetFileNameWithoutExtension(fileName).Split("_");
        return parts.Length >= 3 ? parts[2] : null;
    }

    public async Task ProcessFileLevelFatalErrors(string fileLevelFatalErrors)
    {
        using StringReader reader = new StringReader(fileLevelFatalErrors);
        string line;

        while ((line = reader.ReadLine()) != null)
        {
            var fileLevelFatalError = DeserializeFileLevelFatalError(line);
            var stopId = fileLevelFatalError.FileName.Split("_")[2].Replace(".json", string.Empty);
            IStop stop = await _stopV1CosmosDbService.GetStopAsync(stopId);

            if (stop.StopVersion == StopVersion.V2)
            {
                stop = await _stopV2CosmosDbService.GetStopAsync(stopId);
            }

            SubmissionError submissionError = new SubmissionError
            {
                DateReported = DateTime.UtcNow,
                Code = "FLFE",
                ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.FileLevelFatalError),
                Message = fileLevelFatalError.ErrorMessage,
                FileName = fileLevelFatalError.FileName
            };

            if (stop.StopVersion == StopVersion.V2)
            {
                await _stopV2CosmosDbService.UpdateStopAsync(_stopV2Service.ErrorSubmission((Common.Models.v2.Stop)stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
            }
            else
            {
                await _stopV1CosmosDbService.UpdateStopAsync(_stopV1Service.ErrorSubmission((Common.Models.v1.Stop)stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
            }
        }
    }

    public async Task ProcessRecordLevelErrors(string recordLevelErrors, string type)
    {
        using StringReader reader = new StringReader(recordLevelErrors);
        string line;

        while ((line = reader.ReadLine()) != null)
        {
            var recordLevelError = DeserializeRecordLevelError(line);
            IStop stop = await _stopV1CosmosDbService.GetStopAsync(recordLevelError.LeaRecordId);

            if (stop.StopVersion == StopVersion.V2)
            {
                stop = await _stopV2CosmosDbService.GetStopAsync(recordLevelError.LeaRecordId);
            }

            SubmissionError submissionError = new SubmissionError
            {
                DateReported = DateTime.UtcNow,
                Code = type == Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError) ? "RLFE" : recordLevelError.ErrorList.Split("::")[0],
                ErrorType = type,
                Message = type == Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError) ? recordLevelError.ErrorList : recordLevelError.ErrorList.Split("::")[1],
                FileName = recordLevelError.FileName
            };

            if (stop.StopVersion == StopVersion.V2)
            {
                await _stopV2CosmosDbService.UpdateStopAsync(_stopV2Service.ErrorSubmission((Common.Models.v2.Stop)stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
            }
            else
            {
                await _stopV1CosmosDbService.UpdateStopAsync(_stopV1Service.ErrorSubmission((Common.Models.v1.Stop)stop, submissionError, Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed)));
            }
        }
    }

    public static FileLevelFatalError DeserializeFileLevelFatalError(string fileLevelFatalErrorString)
    {
        string[] values = fileLevelFatalErrorString.Split("|");
        FileLevelFatalError fileLevelFatalError = new FileLevelFatalError
        {
            AgencyOri = values[0],
            FileName = values[1],
            DateSubmitted = values[2],
            TimeSubmitted = values[3],
            ErrorMessage = values[4].Replace("\"", string.Empty)
        };
        return fileLevelFatalError;
    }

    public class FileLevelFatalError
    {
        public string AgencyOri { get; set; }
        public string FileName { get; set; }
        public string DateSubmitted { get; set; }
        public string TimeSubmitted { get; set; }
        public string ErrorMessage { get; set; }
    }

    public static RecordLevelError DeserializeRecordLevelError(string recordLevelErrorString)
    {
        string[] values = recordLevelErrorString.Split("|");
        RecordLevelError recordLevelError = new RecordLevelError
        {
            AgencyOri = values[0],
            FileName = values[1],
            LeaRecordId = values[2],
            ErrorList = values[3].Replace("\"", string.Empty)
        };
        return recordLevelError;
    }

    public class RecordLevelError
    {
        public string AgencyOri { get; set; }
        public string FileName { get; set; }
        public string LeaRecordId { get; set; }
        public string ErrorList { get; set; }
    }
}
