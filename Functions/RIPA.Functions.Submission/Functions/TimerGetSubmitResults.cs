using Azure.Messaging.ServiceBus;
using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using RIPA.Functions.Submission.Utility;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static RIPA.Functions.Submission.Services.ServiceBus.ResultServiceBusService;

namespace RIPA.Functions.Submission.Functions;

public class TimerGetSubmitResults
{
    private readonly ISftpService _sftpService;
    private readonly IResultServiceBusService _resultServiceBusService;
    private readonly string _sftpOutputPath;
    private readonly string _storageConnectionString;
    private readonly string _storageContainerNamePrefix;

    public TimerGetSubmitResults(ISftpService sftpService, IResultServiceBusService resultServiceBusService)
    {
        _sftpService = sftpService;
        _sftpOutputPath = Environment.GetEnvironmentVariable("SftpOutputPath");
        _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
        _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixResults");
        _resultServiceBusService = resultServiceBusService;
    }

    [FunctionName("TimerGetSubmitResults")]
    public async Task Run([TimerTrigger("%ResultsRunTime%"
#if DEBUG
        ,RunOnStartup = true
#endif
        )] TimerInfo myTimer, ILogger log)
    {
        log.LogInformation($"Timer trigger runs each day at a time specified in the configuration: {DateTime.Now} and mytimer isPastDue: {myTimer.IsPastDue}");

        IEnumerable<Renci.SshNet.Sftp.ISftpFile> files = null;

        try
        {
            files = await _sftpService.ListAllFiles(_sftpOutputPath);
        }
        catch (Exception e)
        {
            log.LogError($"Unable to list SFTP directory {_sftpOutputPath}: {e.Message}");
            return;
        }

        if (files == null || files.Where(x => x.IsDirectory == false).Count() == 0)
        {
            return; //Nothing to process --> exit
        }

        Guid correlationId = Guid.NewGuid();
        BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
        string containerName = _storageContainerNamePrefix;
        BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
        await blobContainerClient.CreateIfNotExistsAsync();

        foreach (var file in files.Where(x => x.IsDirectory == false))
        {
            try
            {
                var extension = Path.GetExtension(file.Name).ToLowerInvariant();

                if (extension != ".txt" && extension != ".xml" && extension != ".csv")
                {
                    log.LogWarning($"Skipping unsupported DOJ result file {file.Name}");
                    continue;
                }

                log.LogInformation($"processing file {file.Name}");
                var fileText = await _sftpService.DownloadFileToBlobAsync(file.FullName, $"{DateTime.UtcNow.ToString("yyyyMMdd")}/{correlationId}/{file.Name}", blobContainerClient);
                log.LogInformation($"stored file {file.Name} ({fileText?.Length ?? 0} chars) in blob storage");

                if (extension == ".xml")
                {
                    await ProcessDojXmlResponse(fileText, log);
                    log.LogInformation($"processed DOJ XML response {file.Name}");
                }
                else if (extension == ".csv")
                {
                    await ProcessDojResponse(fileText);
                    log.LogInformation($"processed legacy DOJ CSV response {file.Name}");
                }

                await _sftpService.DeleteFile(file.FullName);
                log.LogInformation($"deleted sftp file {file.Name}");
            }
            catch (Exception e)
            {
                log.LogError($"An error occurred processing DOJ SFTP result {file.Name}: {e.Message}");
            }
        }
    }

    public async Task ProcessDojXmlResponse(string dojResponse, ILogger log)
    {
        var resultMessages = DojResultXmlParser.Parse(dojResponse);
        log.LogInformation($"DOJ XML response contained {resultMessages.Count(x => x.IsSuccess)} successful stops and {resultMessages.Count(x => !x.IsSuccess)} stops with errors");

        if (resultMessages.Count == 0)
        {
            return;
        }

        var listServiceBusMessage = resultMessages
            .Select(x => new ServiceBusMessage(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(x))))
            .ToList();

        await _resultServiceBusService.SendServiceBusMessagesAsync(listServiceBusMessage);
    }

    public async Task ProcessDojResponse(string dojResponse)
    {
        var split1 = dojResponse.Split("Agency ORI|File name|Date Submitted|Time Submitted|Error message");
        var split2 = split1[1].Split("Agency ORI|File name|LEA record ID|Error List");
        var fileLevelFatalErrors = split2[0].Replace("Record Level Fatal Errors:", string.Empty).Trim();
        var recordLevelFatalErrors = split2[1].Replace("Record Level Errors:", string.Empty).Trim();
        var recordLevelErrors = split2[2].Trim();
        await ProcessDojErrors(fileLevelFatalErrors, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.FileLevelFatalError));
        await ProcessDojErrors(recordLevelFatalErrors, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelFatalError));
        await ProcessDojErrors(recordLevelErrors, Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.RecordLevelError));
    }

    public async Task ProcessDojErrors(string errorLines, string errorType)
    {
        List<ServiceBusMessage> listServiceBusMessage = new List<ServiceBusMessage>();
        using StringReader reader = new StringReader(errorLines);
        string line;
        while ((line = reader.ReadLine()) != null)
        {
            listServiceBusMessage.Add(new ServiceBusMessage(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new ResultMessage() { Error = line, ErrorType = errorType }))));
        }
        await _resultServiceBusService.SendServiceBusMessagesAsync(listServiceBusMessage);
    }
}
