using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Services.Contracts;
using RIPA.Functions.Security;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.v1.Upload;

public class GetDomainDate
{
    private readonly IDomainCosmosDbService _domainCosmosDbService;

    public GetDomainDate(IDomainCosmosDbService domainCosmosDbService)
    {
        _domainCosmosDbService = domainCosmosDbService;
    }

    [FunctionName("GetDomainDate_v1")]
    [OpenApiOperation(operationId: "v1/GetDomainDate", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(DateTime), Description = "The date of the last domain update")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "v1/GetDomainDate")] HttpRequest req, ILogger log)
    {
        log.LogInformation("Requesting domain date");

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
            var domainDate = await _domainCosmosDbService.GetDomainUploadDate();

            return new OkObjectResult(domainDate);
        }
        catch (Exception ex)
        {
            log.LogError("There was an error getting the domain date", ex.Message);
            return new NotFoundResult();
        }
    }
}

