using Azure.Messaging.ServiceBus;
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
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.Stop.Utility;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.ServiceBus.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using RIPA.Functions.Submission.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using static RIPA.Functions.Submission.Services.ServiceBus.SubmissionServiceBusService;

namespace RIPA.Functions.Submission.Functions;

public class PostSubmitSearch
{
    private readonly ISftpService _sftpService;
    private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
    private readonly IStopCosmosDbService<Common.Models.v1.Stop> _stopV1CosmosDbService;
    private readonly IStopCosmosDbService<Common.Models.v2.Stop> _stopV2CosmosDbService;
    private readonly IUserProfileCosmosDbService<Common.Models.v1.UserProfile> _userProfileV1CosmosDbService;
    private readonly ISubmissionServiceBusService _submissionServiceBusService;

    public PostSubmitSearch(
        ISftpService sftpService,
        ISubmissionCosmosDbService submissionCosmosDbService,
        IStopCosmosDbService<Common.Models.v1.Stop> stopV1CosmosDbService,
        IStopCosmosDbService<Common.Models.v2.Stop> stopV2CosmosDbService,
        IUserProfileCosmosDbService<Common.Models.v1.UserProfile> userProfileV1CosmosDbService,
        ISubmissionServiceBusService submissionServiceBusService
    )
    {
        _sftpService = sftpService;
        _submissionCosmosDbService = submissionCosmosDbService;
        _stopV1CosmosDbService = stopV1CosmosDbService;
        _stopV2CosmosDbService = stopV2CosmosDbService;
        _userProfileV1CosmosDbService = userProfileV1CosmosDbService;
        _submissionServiceBusService = submissionServiceBusService;
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
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "PostSubmitSearch")] HttpRequest req, ILogger log)
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

        IUserProfile userProfile;

        try
        {
            var objectId = await RIPAAuthorization.GetUserId(req, log);
            userProfile = await _userProfileV1CosmosDbService.GetUserProfileAsync(objectId);

            if (userProfile == null)
            {
                throw new Exception($"User profile not found for {objectId}");
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);
            return new BadRequestObjectResult("User profile was not found");
        }

        string stopV1QueryString = string.Empty;
        string stopV2QueryString = string.Empty;

        try
        {
            StopQueryUtility stopQueryUtility = new StopQueryUtility();
            StopQuery stopQuery = stopQueryUtility.GetStopQuery(req);
            stopV1QueryString = stopQueryUtility.GetStopsQueryString(stopQuery, false, 1);
            stopV2QueryString = stopQueryUtility.GetStopsQueryString(stopQuery, false, 2);
        }
        catch (Exception ex)
        {
            log.LogError("An error occured while evaluating the stop query.", ex);
            return new BadRequestObjectResult("An error occured while evaluating the stop query. Please try again.");
        }

        List<IStop> stopResponse = new();

        try
        {
            stopResponse.AddRange(await _stopV1CosmosDbService.GetStopsAsync(stopV1QueryString));
            stopResponse.AddRange(await _stopV2CosmosDbService.GetStopsAsync(stopV2QueryString));
        }
        catch (Exception ex)
        {
            log.LogError(ex, "An error occurred getting stops requested.");
            return new BadRequestObjectResult("An error occurred getting stops requested. Please try again.");
        }

        SubmissionUtilities submissionUtilities = new SubmissionUtilities(_submissionCosmosDbService, _sftpService, log);
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

            foreach (var stop in stopResponse)
            {
                if (stop.Status == SubmissionStatus.Unsubmitted.ToString())
                {
                    stop.Status = SubmissionStatus.Pending.ToString();
                }
                else if (stop.Status == SubmissionStatus.Unsubmitted_NFIA.ToString())
                {
                    stop.Status = SubmissionStatus.Pending_NFIA.ToString();
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
        }
        catch (Exception ex)
        {
            log.LogError($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
            return new BadRequestObjectResult($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
        }

        try
        {
            await _submissionServiceBusService.SendServiceBusMessagesAsync(stopResponse.Select(x => new ServiceBusMessage(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new SubmissionMessage() { StopId = x.Id, StopVersion = (int)x.StopVersion, SubmissionId = submissionId })))).ToList());
            return new OkObjectResult(new { submissionId });
        }
        catch (Exception ex)
        {
            foreach (var stop in stopResponse)
            {
                if (stop.Status == SubmissionStatus.Pending.ToString())
                {
                    stop.Status = SubmissionStatus.Unsubmitted.ToString();
                }
                else if (stop.Status == SubmissionStatus.Pending_NFIA.ToString())
                {
                    stop.Status = SubmissionStatus.Unsubmitted_NFIA.ToString();
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

            log.LogError($"Failure submitting stops to service bus: {ex.Message}");
            return new BadRequestObjectResult($"Failure submitting stops: {ex.Message}");
        }
    }
}
