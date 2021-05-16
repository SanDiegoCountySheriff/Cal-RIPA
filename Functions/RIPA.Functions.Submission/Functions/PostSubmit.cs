using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Collections.Generic;
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
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "List of stops that failed submission")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] SubmitRequest submitRequest, HttpRequest req, ILogger log)
        {
            log.LogInformation("Submit to DOJ requested");

            if (!RIPAAuthorization.ValidateUserOrAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }

            var accessToken = RIPAAuthorization.ExtractTokenFromRequestHeaders(req);

            Guid submissionId = Guid.NewGuid();
            BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
            string containerName = _storageContainerNamePrefix + submissionId.ToString();
            BlobContainerClient blobContainerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);
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

            List<string> failedStopIds = new List<string>();

            foreach (var stopId in submitRequest.StopIds)
            {
                try
                {
                    var stop = await _stopCosmosDbService.GetStopAsync(stopId);
                    DateTime dateSubmitted = DateTime.UtcNow;
                    string fileName = $"{dateSubmitted.ToString("yyyyMMddHHmmss")}_{stop.Ori}_{stop.id}.json";
                    _sftpService.UploadStop(_stopService.CastToDojStop(stop), $"{_sftpInputPath}{fileName}", fileName, blobContainerClient);
                    await _stopCosmosDbService.UpdateStopAsync(stopId, _stopService.NewSubmission(stop, dateSubmitted, submissionId, fileName));
                }
                catch (Exception ex)
                {
                    log.LogError($"Failure Submitting Stop with id {stopId}: {ex.Message}");
                    failedStopIds.Add(stopId);
                    //TODO harden and update stop with failure to submit to DOJ
                }

            }

            return new OkObjectResult(new { failedStopIds });
        }

        public class SubmitRequest
        {
            public List<string> StopIds { get; set; }
        }


    }
}

