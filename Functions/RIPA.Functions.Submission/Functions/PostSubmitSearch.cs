using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;

namespace RIPA.Functions.Submission.Functions
{
    public class PostSubmitSearch
    {
        private readonly ISftpService _sftpService;
        private readonly IStopService _stopService;
        private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly string _sftpInputPath;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;

        public PostSubmitSearch(ISftpService sftpService, IStopService stopService, ISubmissionCosmosDbService submissionCosmosDbService, IStopCosmosDbService stopCosmosDbService)
        {
            _sftpService = sftpService;
            _stopService = stopService;
            _submissionCosmosDbService = submissionCosmosDbService;
            _stopCosmosDbService = stopCosmosDbService;
            _sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixSubmissions");
        }

        [FunctionName("PostSubmitSearch")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "IsSubmitted", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Return Submitted OR UnSubmitted stops, defaults to false")]
        [OpenApiParameter(name: "Status", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String Status: Unsubmitted, Submitted, Resubmitted, Failed")]
        [OpenApiParameter(name: "IsPII", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns Submitted Stops that have been flagged for PII")]
        [OpenApiParameter(name: "ErrorCode", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String ErrorCode: Error code must exist on stop submission to return")]
        [OpenApiParameter(name: "OfficerId", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Returns Submitted Stops where officer id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            //Get the query
            StopQuery stopQuery = new StopQuery
            {
                StartDate = !string.IsNullOrWhiteSpace(req.Query["StartDate"]) ? DateTime.Parse(req.Query["StartDate"]) : default,
                EndDate = !string.IsNullOrWhiteSpace(req.Query["EndDate"]) ? DateTime.Parse(req.Query["EndDate"]) : default,
                ErrorCode = !string.IsNullOrWhiteSpace(req.Query["ErrorCode"]) ? req.Query["ErrorCode"] : default,
                Status = !string.IsNullOrWhiteSpace(req.Query["Status"]) ? req.Query["Status"] : default,
                OfficerId = !string.IsNullOrWhiteSpace(req.Query["OfficerId"]) ? req.Query["OfficerId"] : default,
            };

            if (!string.IsNullOrWhiteSpace(req.Query["isPii"]))
            {
                stopQuery.IsPII = bool.Parse(req.Query["isPii"]);
            }
            if (!string.IsNullOrWhiteSpace(req.Query["IsSubmitted"]))
            {
                stopQuery.IsSubmitted = bool.Parse(req.Query["IsSubmitted"]);
            }

            List<string> whereStatements = new List<string>();
            string join = string.Empty;

            //Date Range
            if (stopQuery.StartDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.StopDateTime > '{(DateTime)stopQuery.StartDate:o}'");
            }
            if (stopQuery.EndDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.StopDateTime < '{(DateTime)stopQuery.EndDate:o}'");
            }

            //IsPII
            if (stopQuery.IsPII != null)
            {
                whereStatements.Add(Environment.NewLine + $"c.IsPiiFound = {stopQuery.IsPII.ToString().ToLowerInvariant()}");
            }

            //Status
            if (!string.IsNullOrWhiteSpace(stopQuery.Status))
            {
                if (stopQuery.Status == SubmissionStatus.Unsubmitted.ToString())
                {
                    whereStatements.Add(Environment.NewLine + $"c.Status = null");
                }
                else
                {
                    whereStatements.Add(Environment.NewLine + $"c.Status = '{stopQuery.Status}'");
                }
            }

            //ErrorCode
            if (!string.IsNullOrWhiteSpace(stopQuery.ErrorCode))
            {
                join += Environment.NewLine + "JOIN ListSubmission IN c.ListSubmission";
                join += Environment.NewLine + "JOIN ListSubmissionError IN ListSubmission.ListSubmissionError";
                whereStatements.Add(Environment.NewLine + $"ListSubmissionError.Code = '{stopQuery.ErrorCode}'");
            }

            //IsSubmitted
            if (stopQuery.IsSubmitted != null)
            {
                if (!bool.Parse(stopQuery.IsSubmitted.ToString()))
                    whereStatements.Add(Environment.NewLine + $"c.Status = null");
                else
                    whereStatements.Add(Environment.NewLine + $"c.Status != null");
            }

            //OfficerId
            if (!string.IsNullOrWhiteSpace(stopQuery.OfficerId))
            {
                whereStatements.Add(Environment.NewLine + $"c.OfficerId = '{stopQuery.OfficerId}'");
            }

            string where = string.Empty;
            if (whereStatements.Count > 0)
            {
                where = " WHERE ";

                foreach (var whereStatement in whereStatements)
                {
                    where += Environment.NewLine + whereStatement;
                    where += Environment.NewLine + "AND";
                }
                where = where.Remove(where.Length - 3);
            }

            var order = Environment.NewLine + "ORDER BY c.StopDateTime DESC";

            IEnumerable<Stop> stopResponse = await _stopCosmosDbService.GetStopsAsync($"SELECT VALUE c FROM c {join} {where} {order}");


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
                    RecordCount = stopResponse.Count()
                };
                await _submissionCosmosDbService.AddSubmissionAsync(submission);
            }
            catch (Exception ex)
            {
                log.LogError($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
                return new BadRequestObjectResult($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
            }

            foreach (var stop in stopResponse)
            {
                string fileName = string.Empty;
                DateTime dateSubmitted = DateTime.UtcNow;
                try
                {
                    fileName = $"{dateSubmitted.ToString("yyyyMMddHHmmss")}_{stop.Ori}_{stop.id}.json";
                    _sftpService.UploadStop(_stopService.CastToDojStop(stop), $"{_sftpInputPath}{fileName}", fileName, blobContainerClient);
                    await _stopCosmosDbService.UpdateStopAsync(stop.id, _stopService.NewSubmission(stop, dateSubmitted, submissionId, fileName));
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
                    await _stopCosmosDbService.UpdateStopAsync(stop.id, _stopService.ErrorSubmission(stop, submissionError));
                    log.LogError($"Failure Submitting Stop with id {stop.id}: {ex.Message}");
                }
            }

            return new OkObjectResult(new { submissionId });

        }
    }
}

