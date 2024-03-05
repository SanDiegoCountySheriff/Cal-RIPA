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
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Stop.Functions.v1;

public class GetPiiEntities
{
    private readonly IStopCosmosDbService<Common.Models.v1.Stop> _stopCosmosDbService;

    public GetPiiEntities(IStopCosmosDbService<Common.Models.v1.Stop> stopCosmosDbService)
    {
        _stopCosmosDbService = stopCosmosDbService;
    }

    [FunctionName("GetPiiEntities_v1")]
    [OpenApiOperation(operationId: "v1/GetPiiEntities", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(PiiEntitiesResponse), Description = "List of Pii Entities")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/GetPiiEntities")] HttpRequest req, ILogger log)
    {
        log.LogInformation("GET - Get Pii Entities requested");

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

        List<PiiEntitiesResponse> piiEntitiesResponse = new();
        List<Common.Models.v1.Stop> response = new();

        try
        {
            response.AddRange(await _stopCosmosDbService.GetPiiEntitiesResponseAsync(1));

            foreach (var stop in response)
            {
                for (var i = 0; i < stop.ListPersonStopped.Length; i++)
                {
                    if (!string.IsNullOrEmpty(stop.ListPersonStopped[i].ReasonForStopExplanation))
                    {
                        piiEntitiesResponse.Add(new PiiEntitiesResponse()
                        {
                            StopId = stop.Id,
                            EntityText = stop.ListPersonStopped[i].ReasonForStopExplanation,
                            Source = $"Person {i + 1}"
                        });
                    }

                    if (!string.IsNullOrEmpty(stop.ListPersonStopped[i].BasisForSearchBrief))
                    {
                        piiEntitiesResponse.Add(new PiiEntitiesResponse()
                        {
                            StopId = stop.Id,
                            EntityText = stop.ListPersonStopped[i].BasisForSearchBrief,
                            Source = $"Person {i + 1}"
                        });
                    }
                }

                var location = stop.Location as Common.Models.v1.Location;

                var locationString = $"{location.StreetName} {location.BlockNumber} {location.LandMark} {location.Intersection} {location.HighwayExit}";

                if (!string.IsNullOrWhiteSpace(locationString))
                {
                    piiEntitiesResponse.Add(new PiiEntitiesResponse()
                    {
                        StopId = stop.Id,
                        EntityText = locationString,
                        Source = "Location"
                    });
                }
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex, "An error occurred getting pii entities requested.");
            return new BadRequestObjectResult("An error occurred getting pii entities requested. Please try again.");
        }

        return new OkObjectResult(piiEntitiesResponse);
    }
}
