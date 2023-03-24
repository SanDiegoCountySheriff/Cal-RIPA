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
using RIPA.Functions.Common.Models.v1;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
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

public class PostSubmit
{
    private readonly ISftpService _sftpService;
    private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
    private readonly IStopCosmosDbService _stopCosmosDbService;
    private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;
    private readonly ISubmissionServiceBusService _serviceBusService;

    public PostSubmit(ISftpService sftpService, ISubmissionCosmosDbService submissionCosmosDbService, IStopCosmosDbService stopCosmosDbService, IUserProfileCosmosDbService userProfileCosmosDbService, ISubmissionServiceBusService serviceBusService)
    {
        _sftpService = sftpService;
        _submissionCosmosDbService = submissionCosmosDbService;
        _stopCosmosDbService = stopCosmosDbService;
        _userProfileCosmosDbService = userProfileCosmosDbService;
        _serviceBusService = serviceBusService;
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

        UserProfile userProfile;
        try
        {
            var objectId = await RIPAAuthorization.GetUserId(req, log);
            userProfile = (await _userProfileCosmosDbService.GetUserProfileAsync(objectId));
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

        if (submitRequest?.StopIds == null || submitRequest.StopIds.Count == 0)
        {
            return new BadRequestObjectResult("stop ids are required");
        }

        var where = Environment.NewLine + $"WHERE c.id IN ('{string.Join("','", submitRequest.StopIds)}')";
        var order = Environment.NewLine + $"ORDER BY c.StopDateTime DESC";

        IEnumerable<Stop> stopResponse;
        try
        {
            stopResponse = await _stopCosmosDbService.GetStopsAsync($"SELECT VALUE c FROM c {where} {order}");
        }
        catch (Exception ex)
        {
            log.LogError(ex, "An error occurred getting stops requested.");
            return new BadRequestObjectResult("An error occurred getting stops requested. Please try again.");
        }

        SubmissionUtilities submissionUtilities = new SubmissionUtilities(_stopCosmosDbService, _submissionCosmosDbService, _sftpService, log);
        Guid submissionId;

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
                stop.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Pending);
                await _stopCosmosDbService.UpdateStopAsync(stop);
            }
        }
        catch (Exception ex)
        {
            log.LogError($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
            return new BadRequestObjectResult($"Failure Adding Submission to CosmosDb, No Records Submitted: {ex.Message}");
        }

        try
        {
            await _serviceBusService.SendServiceBusMessagesAsync(stopResponse.Select(x => new ServiceBusMessage(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new SubmissionMessage() { StopId = x.Id, SubmissionId = submissionId })))).ToList());
            return new OkObjectResult(new { submissionId });
        }
        catch (Exception ex)
        {
            foreach (var stop in stopResponse)
            {
                stop.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Unsubmitted);
                await _stopCosmosDbService.UpdateStopAsync(stop);
            }
            log.LogError($"Failure submitting stops to service bus: {ex.Message}");
            return new BadRequestObjectResult($"Failure submitting stops: {ex.Message}");
        }
    }

    public class SubmitRequest
    {
        public List<string> StopIds { get; set; }
    }
}
