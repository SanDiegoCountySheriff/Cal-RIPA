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
using RIPA.Functions.Common.Models.v2;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using RIPA.Functions.Stop.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v2;

public class PostSeedStops
{
    private readonly IStopCosmosDbService<Common.Models.v2.Stop> _stopCosmosDbService;
    private readonly IUserProfileCosmosDbService<UserProfile> _userProfileCosmosDbService;

    public PostSeedStops(
        IStopCosmosDbService<Common.Models.v2.Stop> stopCosmosDbService,
        IUserProfileCosmosDbService<UserProfile> userProfileCosmosDbService)
    {
        _stopCosmosDbService = stopCosmosDbService;
        _userProfileCosmosDbService = userProfileCosmosDbService;
    }

    [FunctionName("PostSeedStops_v2")]
    [OpenApiOperation(operationId: "v2/PostSeedStops", tags: new[] { "name", "v2" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(SeedStopsRequest), Required = true, Description = "Seed stops request")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(int), Description = "Number of stops created")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "Bad request")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.NotFound, contentType: "application/json", bodyType: typeof(string), Description = "Not available outside DEV environment")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v2/PostSeedStops")] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("POST - PostSeedStops v2 requested");

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

        SeedStopsRequest request;
        try
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            request = JsonConvert.DeserializeObject<SeedStopsRequest>(requestBody);
        }
        catch
        {
            return new BadRequestObjectResult("Invalid request body");
        }

        if (request == null || request.Count < 1 || request.Count > 1000)
        {
            return new BadRequestObjectResult("Count must be between 1 and 1000");
        }

        if (string.IsNullOrEmpty(request.StatuteCode))
        {
            return new BadRequestObjectResult("A valid statute code is required");
        }

        if (string.IsNullOrEmpty(request.CityCode))
        {
            return new BadRequestObjectResult("A valid city code is required");
        }

        UserProfile userProfile;
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
        int created = 0;

        for (int i = 0; i < request.Count; i++)
        {
            var stopDateTime = DateTime.UtcNow.AddDays(-(i + 1)).AddMinutes(-(i % 60));
            string date = stopDateTime.ToString("yyyy-MM-dd");
            string time = stopDateTime.ToString("HH:mm");
            var stop = BuildSeedStop(userProfile, ori, date, time, request.StatuteCode, request.StatuteText, request.CityCode, request.CityText);
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

    private static Common.Models.v2.Stop BuildSeedStop(
        UserProfile userProfile,
        string ori,
        string date,
        string time,
        string statuteCode,
        string statuteText,
        string cityCode,
        string cityText)
    {
        return new Common.Models.v2.Stop
        {
            Id = Guid.NewGuid().ToString("N")[..12].ToUpper(),
            Ori = ori,
            Agency = userProfile.Agency,
            OfficerId = userProfile.OfficerId,
            OfficerName = userProfile.Name,
            OfficerRace = userProfile.OfficerRace?.ToArray() ?? new string[0],
            OfficerGender = userProfile.OfficerGender,
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
                GeoLocation = new GeoLocation(),
                City = new City
                {
                    Codes = new Codes
                    {
                        Code = cityCode,
                        Text = cityText
                    }
                },
                School = false,
                OutOfCounty = false,
                PiiFound = false
            },
            StopDuration = 10,
            StopInResponseToCFS = false,
            StopMadeDuringWelfareCheck = false,
            StopType = "Vehicular",
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
                    PerceivedUnhoused = false,
                    ListPerceivedOrKnownDisability = new PerceivedOrKnownDisability[]
                    {
                        new PerceivedOrKnownDisability { Key = "8", Disability = "None" }
                    },
                    PerceivedAge = 30,
                    PerceivedGender = "Cisgender Man/Boy",
                    NonBinaryPerson = false,
                    PerceivedSexualOrientation = "Straight/Heterosexual",
                    ReasonForStop = new ReasonForStop
                    {
                        Key = "1",
                        Reason = "Traffic Violation",
                        ListDetail = new List<Detail>
                        {
                            new Detail { Key = "1", Reason = "Moving Violation" }
                        },
                        ListCodes = new List<Codes>
                        {
                            new Codes { Code = statuteCode, Text = statuteText }
                        }
                    },
                    ReasonGivenForStop = new ReasonGivenForStop[]
                    {
                        new ReasonGivenForStop { Key = "1", Reason = "Traffic Violation - Moving Violation" }
                    },
                    ReasonForStopExplanation = "Explanation",
                    ReasonForStopPiiFound = false,
                    ListNonForceActionsTakenDuringStop = new NonForceActionsTakenDuringStop[0],
                    ListForceActionsTakenDuringStop = new ForceActionsTakenDuringStop[0],
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
                            Key = "14",
                            Result = "Verbal Warning",
                            ListCodes = new List<Codes>
                            {
                                new Codes { Code = statuteCode, Text = statuteText }
                            }
                        }
                    }
                }
            },
            Status = SubmissionStatus.Unsubmitted.ToString(),
            IsPiiFound = false,
            OverridePii = false,
            IsEdited = false,
            StopVersion = StopVersion.V2
        };
    }
}
