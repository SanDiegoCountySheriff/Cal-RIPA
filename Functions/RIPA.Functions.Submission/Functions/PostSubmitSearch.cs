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
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using RIPA.Functions.Submission.Utility;

namespace RIPA.Functions.Submission.Functions
{
    public class PostSubmitSearch
    {
        private readonly ISftpService _sftpService;
        private readonly IStopService _stopService;
        private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;
        private readonly string _sftpInputPath;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;

        public PostSubmitSearch(ISftpService sftpService, IStopService stopService, ISubmissionCosmosDbService submissionCosmosDbService, IStopCosmosDbService stopCosmosDbService, IUserProfileCosmosDbService userProfileCosmosDbService)
        {
            _sftpService = sftpService;
            _stopService = stopService;
            _submissionCosmosDbService = submissionCosmosDbService;
            _stopCosmosDbService = stopCosmosDbService;
            _userProfileCosmosDbService = userProfileCosmosDbService;
            _sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixSubmissions");
        }

        [FunctionName("PostSubmitSearch")]
        [OpenApiOperation(operationId: "PostSubmitSearch", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "StartDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "EndDate", In = ParameterLocation.Query, Required = false, Type = typeof(DateTime), Description = "Starting DateTime for date range stops query")]
        [OpenApiParameter(name: "Status", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String Status: Unsubmitted, Submitted, Failed")]
        [OpenApiParameter(name: "IsPII", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns Submitted Stops that have been flagged for PII")]
        [OpenApiParameter(name: "IsEdited", In = ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Returns stops that have isEdited")]
        [OpenApiParameter(name: "ErrorCode", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "String ErrorCode: Error code must exist on stop submission to return")]
        [OpenApiParameter(name: "OfficerId", In = ParameterLocation.Query, Required = false, Type = typeof(string), Description = "Returns Submitted Stops where officer id")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Submission Id")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
        {
            log.LogInformation("Submit to DOJ requested - submit search");
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

            UserProfile userProfile;
            try
            {
                var objectId = await RIPAAuthorization.GetUserId(req, log);
                userProfile = (await _userProfileCosmosDbService.GetUserProfileAsync(objectId));
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);

                return new BadRequestObjectResult("User profile was not found");
            }

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
            if (!string.IsNullOrWhiteSpace(req.Query["IsEdited"]))
            {
                stopQuery.IsEdited = bool.Parse(req.Query["IsEdited"]);
            }

            List<string> whereStatements = new List<string>();
            string join = string.Empty;

            //Date Range
            if (stopQuery.StartDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.Date >= '{(DateTime)stopQuery.StartDate:yyyy-MM-dd}'");
            }
            if (stopQuery.EndDate != default(DateTime))
            {
                whereStatements.Add(Environment.NewLine + $"c.Date <= '{(DateTime)stopQuery.EndDate:yyyy-MM-dd}'");
            }

            //IsPII
            if (stopQuery.IsPII != null)
            {
                whereStatements.Add(Environment.NewLine + $"c.IsPiiFound = {stopQuery.IsPII.ToString().ToLowerInvariant()}");
            }

            //IsEdited
            if (stopQuery.IsEdited != null)
            {
                whereStatements.Add(Environment.NewLine + $"c.IsEdited = {stopQuery.IsEdited.ToString().ToLowerInvariant()}");
            }

            //Status
            if (!string.IsNullOrWhiteSpace(stopQuery.Status))
            {
                whereStatements.Add(Environment.NewLine + $"c.Status = '{stopQuery.Status}'");
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

            IEnumerable<Stop> stopResponse;
            try
            {
                stopResponse = await _stopCosmosDbService.GetStopsAsync($"SELECT VALUE c FROM c {join} {where} {order}");
            }
            catch (Exception ex)
            {
                log.LogError(ex, "An error occurred getting stops requested.");
                return new BadRequestObjectResult("An error occurred getting stops requested. Please try again.");
            }

            SubmissionUtilities submissionUtilities = new SubmissionUtilities(_stopCosmosDbService, _submissionCosmosDbService, _sftpService, _stopService, log);
            Guid submissionId;

            if (!submissionUtilities.IsValidSFTPConnection())
            {
                return new BadRequestObjectResult("An error occurred connecting to DOJ SFTP service.");
            }

            try
            {
                List<string> errorList = submissionUtilities.ValidateStops(stopResponse);
                if (errorList.Any())
                {
                    errorList.Add("Please adjust your filter criteria and try again.");
                    return new BadRequestObjectResult(string.Join(Environment.NewLine, errorList));
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "An error occurred validating stops.");
                return new BadRequestObjectResult("An error validating stops requested. Please try again.");
            }

            try
            {
                submissionId = await submissionUtilities.NewSubmission(stopResponse, userProfile);
            }
            catch (Exception ex)
            {
                log.LogError($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
                return new BadRequestObjectResult($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
            }

            await submissionUtilities.SubmitStops(stopResponse, submissionId);

            return new OkObjectResult(new { submissionId });

        }
    }
}

