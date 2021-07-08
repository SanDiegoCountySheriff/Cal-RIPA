using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;


namespace RIPA.Functions.Submission.Functions
{
    public class PostSubmit
    {
        private readonly ISftpService _sftpService;
        private readonly IStopService _stopService;
        private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly string _sftpInputPath;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;

        public PostSubmit(ISftpService sftpService, IStopService stopService, ISubmissionCosmosDbService submissionCosmosDbService, IStopCosmosDbService stopCosmosDbService)
        {
            _sftpService = sftpService;
            _stopService = stopService;
            _submissionCosmosDbService = submissionCosmosDbService;
            _stopCosmosDbService = stopCosmosDbService;
            _sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixSubmissions");
        }

        [FunctionName("PostSubmit")]
        [OpenApiOperation(operationId: "PostSubmit", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(SubmitRequest), Deprecated = false, Description = "list of stop ids to submit to DOJ", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of stops that failed submission")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] SubmitRequest submitRequest, HttpRequest req, ILogger log)
        {
            log.LogInformation("Submit to DOJ requested");
            try
            {
                if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
                {
                    return new UnauthorizedResult();
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new UnauthorizedResult();
            }

            if (submitRequest?.StopIds == null || submitRequest.StopIds.Count == 0)
            {
                return new BadRequestObjectResult("stop ids are required");
            }

            IEnumerable<Stop> stopResponse;
            try
            {
                stopResponse = await _stopCosmosDbService.GetStopsAsync($"SELECT * FROM c WHERE c.id IN ('{string.Join("','", submitRequest.StopIds)}')");
            }
            catch(Exception ex)
            {
                log.LogError(ex, "An error occured getting stops requested.");
                return new BadRequestObjectResult("An error occured getting stops requested. Please try again.");
            }

            try
            {
                var timezones = TimeZoneInfo.GetSystemTimeZones();
                log.LogInformation($"found {timezones.Count.ToString()} timezones");
                var timezone = timezones.Where(x => x.Id == "Pacific Standard Time").FirstOrDefault();
                var currentPST = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, timezone.Id);
                var CutoffDate = new DateTime(currentPST.Year - 1, 1, 1); //beginning of last year
                if (currentPST > new DateTime(currentPST.Year, 3, 31, 23, 59, 59)) // 03/31 11:59:59 PM
                {
                    CutoffDate = new DateTime(currentPST.Year, 1, 1); //beginning this year
                }

                if (stopResponse.Where(x => x.StopDateTime < CutoffDate).Any())
                {
                    return new BadRequestObjectResult("Stop request contains stops from previous submission year. Please adjust your filter criteria and try again.");
                }

                if (stopResponse.Where(x => x.Status == SubmissionStatus.Failed.ToString() && x.IsEdited == false).Any())
                {
                    return new BadRequestObjectResult("Stop request contains stops that are in Error state and require edit to submit. Please adjust your filter criteria and try again.");
                }
            }
            catch(Exception ex)
            {
                log.LogError(ex, "An error occured validating stops.");
                return new BadRequestObjectResult("An error validating stops requested. Please try again.");
            }

            Guid submissionId = Guid.NewGuid();
            BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
            string containerName = $"{_storageContainerNamePrefix}";
            BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
            await blobContainerClient.CreateIfNotExistsAsync();

            try
            {
                Models.Submission submission = new Models.Submission
                {
                    DateSubmitted = DateTime.UtcNow,
                    Id = submissionId,
                    RecordCount = submitRequest.StopIds.Count
                };
                await _submissionCosmosDbService.AddSubmissionAsync(submission);
            }
            catch (Exception ex)
            {
                log.LogError($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
                return new BadRequestObjectResult($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
            }


            foreach (var stopId in submitRequest.StopIds)
            {
                string fileName = string.Empty;
                var stop = new Stop();
                DateTime dateSubmitted = DateTime.UtcNow;
                try
                {
                    stop = await _stopCosmosDbService.GetStopAsync(stopId);
                    fileName = $"{DateTime.UtcNow.ToString("yyyyMMdd")}/{submissionId}/{dateSubmitted:yyyyMMddHHmmss}_{stop.Ori}_{stop.Id}.json";
                    await _stopCosmosDbService.UpdateStopAsync(stopId, _stopService.NewSubmission(stop, dateSubmitted, submissionId, fileName));
                    _sftpService.UploadStop(_stopService.CastToDojStop(stop), $"{_sftpInputPath}{fileName}", fileName, blobContainerClient);
                }
                catch (Exception ex)
                {
                    SubmissionError submissionError = new SubmissionError()
                    {
                        Code = "FTS",
                        Message = "Failed to submit to DOJ. SFTP connection, Blob Connection, or Cast failure",
                        DateReported = dateSubmitted,
                        ErrorType = Enum.GetName(typeof(SubmissionErrorType), SubmissionErrorType.SubmissionError),
                        FileName = fileName
                    };
                    await _stopCosmosDbService.UpdateStopAsync(stopId, _stopService.ErrorSubmission(stop, submissionError));
                    log.LogError($"Failure Submitting Stop with id {stopId}: {ex.Message}");
                }
            }

            return new OkObjectResult(new { submissionId });
        }

        public class SubmitRequest
        {
            public List<string> StopIds { get; set; }
        }


    }
}

