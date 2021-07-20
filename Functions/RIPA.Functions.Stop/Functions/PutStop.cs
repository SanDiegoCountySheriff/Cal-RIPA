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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;


namespace RIPA.Functions.Stop.Functions
{
    public class PutStop
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;
        private readonly char[] BASE36_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();

        public PutStop(IStopCosmosDbService stopCosmosDbService, IUserProfileCosmosDbService userProfileCosmosDbService)
        {
            _stopCosmosDbService = stopCosmosDbService;
            _userProfileCosmosDbService = userProfileCosmosDbService;
        }

        [FunctionName("PutStop")]
        [OpenApiOperation(operationId: "PutStop", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiParameter(name: "Id", In = ParameterLocation.Path, Required = true, Type = typeof(int), Description = "The Stop Id/ori")]
        [OpenApiRequestBody(contentType: "application/Json", bodyType: typeof(Common.Models.Stop), Deprecated = false, Description = "Stop object", Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(Common.Models.Stop), Description = "Stop Created")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Stop failed on insert or replace")]

        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "put", Route = "PutStop/{Id}")] Common.Models.Stop stop, HttpRequest req, string Id, ILogger log)
        {
            log.LogInformation("PUT - Put Stop requested");

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


            stop.Id = Id;
            if (stop.Id == "0")
            {
                DateTime now = DateTime.Now;
                StringBuilder sb = new StringBuilder();

                sb.Append(stop.OfficerId.Substring(6, 3));
                sb.Append(BASE36_CHARS[now.Year - 2000]);
                sb.Append(BASE36_CHARS[now.Month]);
                sb.Append(BASE36_CHARS[now.Day]);
                sb.Append(BASE36_CHARS[now.Hour]);
                sb.Append(now.ToString("mmssf"));

                stop.Id = sb.ToString();
            }

            stop.Ori = Environment.GetEnvironmentVariable("ORI"); //What is an Originating Agency Identification (ORI) Number? A nine-character identifier assigned to an agency. Agencies must identify their ORI Number...

            bool isDuplicate = await _stopCosmosDbService.CheckForDuplicateStop(stop.Id, stop.Ori, stop.OfficerId, stop.Date, stop.Time);
            if (isDuplicate)
            {
                return new BadRequestObjectResult("This appears to be a duplicate Stop");
            }

            stop.IsEdited = false;
            if (await _stopCosmosDbService.GetStopAsync(stop.Id) != null)
            {
                stop.IsEdited = true;
            }

            await _stopCosmosDbService.UpdateStopAsync(stop.Id, stop);

            return new OkObjectResult(stop);
        }
    }
}

