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
using RIPA.Functions.Common.Models.v1;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v1;

public class PostSeedStops
{
    private readonly IStopCosmosDbService<Common.Models.v1.Stop> _stopCosmosDbService;
    private readonly IUserProfileCosmosDbService<Common.Models.v1.UserProfile> _userProfileCosmosDbService;

    public PostSeedStops(
        IStopCosmosDbService<Common.Models.v1.Stop> stopCosmosDbService,
        IUserProfileCosmosDbService<Common.Models.v1.UserProfile> userProfileCosmosDbService)
    {
        _stopCosmosDbService = stopCosmosDbService;
        _userProfileCosmosDbService = userProfileCosmosDbService;
    }

    [FunctionName("PostSeedStops_v1")]
    [OpenApiOperation(operationId: "v1/PostSeedStops", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiParameter(name: "count", In = ParameterLocation.Query, Required = true, Type = typeof(int), Description = "Number of stops to seed (1-100)")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int), Description = "Number of stops created")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Bad request")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.NotFound, contentType: "application/json", bodyType: typeof(string), Description = "Not available outside DEV environment")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/PostSeedStops")] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("POST - PostSeedStops v1 requested");

        if (!string.Equals(Environment.GetEnvironmentVariable("EnvironmentName"), "DEV", StringComparison.OrdinalIgnoreCase))
        {
            return new NotFoundResult();
        }

        try
        {
            if (!RIPAAuthorization.ValidateAdministratorRole(req, log).ConfigureAwait(false).GetAwaiter().GetResult())
            {
                return new UnauthorizedResult();
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);
            return new UnauthorizedResult();
        }

        if (!int.TryParse(req.Query["count"], out int count) || count < 1 || count > 100)
        {
            return new BadRequestObjectResult("Count must be between 1 and 100");
        }

        Common.Models.v1.UserProfile userProfile;
        try
        {
            var objectId = await RIPAAuthorization.GetUserId(req, log);
            userProfile = await _userProfileCosmosDbService.GetUserProfileAsync(objectId);
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);
            return new BadRequestObjectResult("User profile was not found");
        }

        string ori = Environment.GetEnvironmentVariable("ORI");
        string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
        int created = 0;

        for (int i = 0; i < count; i++)
        {
            string time = $"{(12 + i / 60) % 24:D2}:{i % 60:D2}";
            var stop = BuildSeedStop(userProfile, ori, today, time);
            try
            {
                await _stopCosmosDbService.UpdateStopAsync(stop);
                created++;
            }
            catch (Exception ex)
            {
                log.LogError($"Failed to seed stop {i}: {ex.Message}");
            }
        }

        return new OkObjectResult(created);
    }

    private static Common.Models.v1.Stop BuildSeedStop(
        Common.Models.v1.UserProfile userProfile,
        string ori,
        string date,
        string time)
    {
        return new Common.Models.v1.Stop
        {
            Id = Guid.NewGuid().ToString("N").Substring(0, 11).ToUpper(),
            Ori = ori,
            Agency = userProfile.Agency,
            OfficerId = userProfile.OfficerId,
            OfficerName = userProfile.Name,
            ExpYears = userProfile.YearsExperience.ToString(),
            OfficerAssignment = new OfficerAssignment
            {
                Key = "1",
                Type = "Patrol, traffic enforcement, field operations",
                OtherType = null
            },
            Date = date,
            Time = time,
            Location = new Location
            {
                BlockNumber = "100",
                StreetName = "Main St",
                City = new City
                {
                    Codes = new Codes
                    {
                        Code = "001",
                        Text = "San Diego"
                    }
                },
                School = false,
                OutOfCounty = false,
                PiiFound = false
            },
            StopDuration = 10,
            StopInResponseToCFS = false,
            ListPersonStopped = new IPersonStopped[]
            {
                new PersonStopped
                {
                    Id = "1",
                    IsStudent = false,
                    ListPerceivedRace = new PerceivedRace[]
                    {
                        new PerceivedRace { Key = 7, Race = "White" }
                    },
                    PerceivedLimitedEnglish = false,
                    ListPerceivedOrKnownDisability = new PerceivedOrKnownDisability[0],
                    PerceivedAge = 30,
                    PerceivedGender = "Male",
                    GenderNonconforming = false,
                    PerceivedLgbt = false,
                    ReasonForStop = new ReasonForStop
                    {
                        Key = "1",
                        Reason = "Traffic Violation",
                        ListDetail = new List<Detail>
                        {
                            new Detail { Key = "1", Reason = "Traffic Violation" }
                        },
                        ListCodes = new List<Codes>
                        {
                            new Codes { Code = "35152", Text = "CVC 35152" }
                        }
                    },
                    ReasonForStopExplanation = null,
                    ReasonForStopPiiFound = false,
                    ListActionTakenDuringStop = new ActionTakenDuringStop[0],
                    PersonSearchConsentGiven = false,
                    PropertySearchConsentGiven = false,
                    ListContrabandOrEvidenceDiscovered = new ContrabandOrEvidenceDiscovered[0],
                    ListBasisForSearch = new BasisForSearch[0],
                    BasisForSearchBrief = null,
                    BasisForSearchPiiFound = false,
                    ListBasisForPropertySeizure = new BasisForPropertySeizure[0],
                    ListTypeOfPropertySeized = new TypeOfPropertySeized[0],
                    ListResultOfStop = new ResultOfStop[]
                    {
                        new ResultOfStop
                        {
                            Key = "2",
                            Result = "Warning (verbal or written)",
                            ListCodes = new List<Codes>()
                        }
                    }
                }
            },
            Status = SubmissionStatus.Unsubmitted.ToString(),
            IsPiiFound = false,
            OverridePii = false,
            IsEdited = false,
            StopVersion = StopVersion.V1
        };
    }
}
