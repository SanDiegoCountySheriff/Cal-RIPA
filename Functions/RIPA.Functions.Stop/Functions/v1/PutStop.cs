using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Stop.Services.Contracts;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v1;

public class PutStop
{
    private readonly IStopCosmosDbService _stopCosmosDbService;
    private readonly IStopAuditCosmosDbService _stopAuditCosmosDbService;
    private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

    public PutStop(IStopCosmosDbService stopCosmosDbService,
        IUserProfileCosmosDbService userProfileCosmosDbService,
        IStopAuditCosmosDbService stopAuditCosmosDbService)
    {
        _stopCosmosDbService = stopCosmosDbService;
        _userProfileCosmosDbService = userProfileCosmosDbService;
        _stopAuditCosmosDbService = stopAuditCosmosDbService;
    }

    [FunctionName("v1/PutStop")]
    [OpenApiOperation(operationId: "v1/PutStop", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Stop Id/ori")]
    [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Common.Models.v1.Stop), Deprecated = false, Description = "Stop object", Required = true)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Common.Models.v1.Stop), Description = "Stop Created")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Stop failed on insert or replace")]
    
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "v1/PutStop/{Id}")] IStop stop, HttpRequest req, string Id, ILogger log)
    {
        log.LogInformation($"PUT - Put Stop requested, ID: {Id}, OID: {stop.OfficerId}, DATE: {stop.Date}, TIME: {stop.Time}");

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

        try
        {
            var objectId = await RIPAAuthorization.GetUserId(req, log);
            stop.EditStopOfficerId = (await _userProfileCosmosDbService.GetUserProfileAsync(objectId)).OfficerId;
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);

            return new BadRequestObjectResult("User profile was not found");
        }

        if (string.IsNullOrEmpty(Id))
        {
            return new BadRequestObjectResult("Stop Id cannot be empty or null");
        }

        if (stop.OfficerId.Length != 9)
        {
            return new BadRequestObjectResult("Officer ID must be 9 char");
        }

        if (stop.Location.City == null)
        {
            return new BadRequestObjectResult("City is required");
        }

        if (stop.Status == null)
        {
            stop.Status = SubmissionStatus.Unsubmitted.ToString();
        }

        stop.Ori = Environment.GetEnvironmentVariable("ORI"); //What is an Originating Agency Identification (ORI) Number? A nine-character identifier assigned to an agency. Agencies must identify their ORI Number...

        bool isDuplicate = await _stopCosmosDbService.CheckForDuplicateStop(stop.Id, stop.Ori, stop.OfficerId, stop.Date, stop.Time);

        if (isDuplicate)
        {
            log.LogError($"This appears to be a duplicate Stop: ID: {Id}, SID: {stop.Id}, OID: {stop.OfficerId}, DATE: {stop.Date}, TIME: {stop.Time}");

            return new BadRequestObjectResult("This appears to be a duplicate Stop");
        }

        stop.IsEdited = Id == "0" ? false : true;

        try
        {
            if (Id != "0")
            {
                //Protect the submission history
                IStop editingStop = await _stopCosmosDbService.GetStopAsync(Id);
                editingStop.Id = $"{stop.Id}-{DateTime.UtcNow:yyyyMMddHHmmss}";
                await _stopAuditCosmosDbService.UpdateStopAuditAsync(editingStop.Id, editingStop);
                log.LogInformation($"Saving stop audit ID: {editingStop.Id}");
                stop.ListSubmission = editingStop.ListSubmission;
            }
        }
        catch (Exception ex)
        {
            log.LogError($"Failed getting stop to protect submission history, ID: {Id}, SID: {stop.Id}, OID: {stop.OfficerId}, DATE: {stop.Date}, TIME: {stop.Time}");

            return new BadRequestObjectResult("Failed getting stop submission history");
        }

        int retryAttempts = GetRetrySetting("RetryAttempts", 3);
        int retrywait = GetRetrySetting("RetryWait", 1000);

        while (retryAttempts > 0)
        {
            try
            {
                stop.Id = Id;
                if (stop.Id == "0")
                {
                    await _stopCosmosDbService.AddStopAsync(stop);
                }
                else
                {
                    if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
                    {
                        return new UnauthorizedResult();
                    }

                    await _stopCosmosDbService.UpdateStopAsync(stop);
                }

                log.LogInformation($"PUT - saved stop, ID: {Id}, SID: {stop.Id}, OID: {stop.OfficerId}, DATE: {stop.Date}, TIME: {stop.Time}");

                return new OkObjectResult(stop);
            }
            catch (Exception exception)
            {
                log.LogError($"Failed to insert/update stop, attempt counter: {retryAttempts}, ID: {Id}, SID: {stop.Id}, OID: {stop.OfficerId}, DATE: {stop.Date}, TIME: {stop.Time}", exception.GetBaseException());
            }

            await Task.Delay(retrywait);

            retryAttempts--;
        }

        log.LogError("The maximum number of attempts to save the STOP was exceeded");
        return new BadRequestObjectResult("The maximum number of attempts to save the STOP was exceeded");
    }

    private static int GetRetrySetting(string settingName, int defaultValue)
    {
        int settingValue = defaultValue;

        string settingString = Environment.GetEnvironmentVariable(settingName);
        if (!string.IsNullOrEmpty(settingString))
        {
            int.TryParse(settingString, out settingValue);
        }

        return settingValue;
    }
}
