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
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Stop.Services.Contracts;
using System;
using System.Net;
using System.Threading.Tasks;
using System.Text.Json;

namespace RIPA.Functions.Stop.Functions.v1;

public class PostMarkPiiFlag
{
    private readonly IStopCosmosDbService<Common.Models.v1.Stop> _stopCosmosDbService;
    private readonly IStopAuditCosmosDbService<Common.Models.v1.Stop> _stopAuditCosmosDbService;
    private readonly IUserProfileCosmosDbService<Common.Models.v1.UserProfile> _userProfileCosmosDbService;

    public PostMarkPiiFlag(IStopCosmosDbService<Common.Models.v1.Stop> stopCosmosDbService,
        IUserProfileCosmosDbService<Common.Models.v1.UserProfile> userProfileCosmosDbService,
        IStopAuditCosmosDbService<Common.Models.v1.Stop> stopAuditCosmosDbService)
    {
        _stopCosmosDbService = stopCosmosDbService;
        _userProfileCosmosDbService = userProfileCosmosDbService;
        _stopAuditCosmosDbService = stopAuditCosmosDbService;
    }

    [FunctionName("PostMarkPiiFlag_v1")]
    [OpenApiOperation(operationId: "v1/PostMarkPiiFlag", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Stop Id/ori")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Common.Models.v1.Stop), Description = "Stop Updated")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Stop failed on insert or replace")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/PostMarkPiiFlag/{Id}")] HttpRequest req, string Id, ILogger log)
    {
        log.LogInformation($"Marking stop ${Id} as false positive");

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

        Common.Models.v1.Stop stop;

        try
        {
            var objectId = await RIPAAuthorization.GetUserId(req, log);
            stop = await _stopCosmosDbService.GetStopAsync(Id);
            stop.EditStopOfficerId = (await _userProfileCosmosDbService.GetUserProfileAsync(objectId)).OfficerId;
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);

            return new BadRequestObjectResult("User profile was not found");
        }

        try
        {
            //Protect the submission history
            Common.Models.v1.Stop editingStop = await _stopCosmosDbService.GetStopAsync(Id);
            editingStop.Id = $"{stop.Id}-{DateTime.UtcNow:yyyyMMddHHmmss}";
            await _stopAuditCosmosDbService.UpdateStopAuditAsync(editingStop.Id, editingStop);
            log.LogInformation($"Saving stop audit ID: {editingStop.Id}");
            stop.ListSubmission = editingStop.ListSubmission;
        }
        catch (Exception ex)
        {
            log.LogError($"Failed getting stop to protect submission history, ID: {Id}, SID: {stop.Id}, OID: {stop.OfficerId}, DATE: {stop.Date}, TIME: {stop.Time}");

            return new BadRequestObjectResult("Failed getting stop submission history");
        }

        try
        {
            stop.IsPiiFound = false;
            stop.OverridePii = true;
            stop.IsEdited = true;
            stop.EditStopExplanation = "PII Override - false positive";

            await _stopCosmosDbService.UpdateStopAsync(stop);
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);

            return new BadRequestResult();
        }

        return new OkResult();
    }
}
