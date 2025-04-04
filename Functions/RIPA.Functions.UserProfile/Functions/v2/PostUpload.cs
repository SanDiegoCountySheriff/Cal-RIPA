using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Services.UserProfile.CosmosDb.Contracts;
using RIPA.Functions.Security;
using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.UserProfile.Functions.v2;

public class PostUpload
{
    private readonly IUserProfileCosmosDbService<Common.Models.v2.UserProfile> _userProfileCosmosDbService;

    public PostUpload(IUserProfileCosmosDbService<Common.Models.v2.UserProfile> userProfileCosmosDbService)
    {
        _userProfileCosmosDbService = userProfileCosmosDbService;
    }

    [FunctionName("PostUpload_v2")]
    [OpenApiOperation(operationId: "v2/PostUpload", tags: new[] { "name", "v2" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiRequestBody(contentType: "multipart/form-data; boundary=<calculated when request is sent>", bodyType: typeof(string), Deprecated = false, Required = true)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Upload Complete")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "File Format Error; Please pass form-data with key: 'file' value: filepath.csv")]

    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v2/PostUpload")] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("Importing user profiles from uploaded csv");
        var count = 0;

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

        try
        {
            using (var reader = new StreamReader(req.Form.Files[0].OpenReadStream()))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var agency = req.Query["agency"];
                csv.Context.RegisterClassMap<UserProfileMap>();
                var records = csv.GetRecords<Common.Models.v2.UserProfile>().ToList();
                count = records.Count();

                foreach (var record in records)
                {
                    record.StartDate = DateTime.Now.AddYears(-record.YearsExperience);
                    if (string.IsNullOrEmpty(record.Agency))
                    {
                        record.Agency = agency;
                    }
                    record.FirstName ??= "";
                    record.LastName ??= "";
                    await _userProfileCosmosDbService.UpdateUserProfileAsync(record.Id, record);
                }
            }

            string responseMessage;

            if (count >= 0)
            {
                responseMessage = $"Upload Complete: {count} {(count > 1 ? "records" : "record")} uploaded";
            }
            else
            {
                responseMessage = "No records found";
            }

            return new OkObjectResult(responseMessage);
        }
        catch (Exception ex)
        {
            log.LogError($"Error uploading users: {ex.Message}");
            return new BadRequestObjectResult("There was an error with the file format.  Please verify data and try again.");
        }
    }
}

public class UserProfileMap : ClassMap<Common.Models.v2.UserProfile>
{
    public UserProfileMap()
    {
        Map(u => u.Id);
        Map(u => u.OfficerId);
        Map(u => u.FirstName).Optional();
        Map(u => u.LastName).Optional();
        Map(u => u.YearsExperience).Optional().TypeConverter<YearsConverter>();
        Map(u => u.Assignment).Optional();
        Map(u => u.OtherType).Optional();
        Map(u => u.Agency).Optional();
        Map(u => u.FavoriteLocations).Ignore();
        Map(u => u.FavoriteReasons).Ignore();
        Map(u => u.FavoriteResults).Ignore();
    }
}

public class YearsConverter : DefaultTypeConverter
{
    public override object ConvertFromString(string text, IReaderRow row, MemberMapData memberMapData)
    {
        if (string.IsNullOrEmpty(text))
        {
            return 1;
        }

        if (!int.TryParse(text, out int yearsExperience) || yearsExperience < 0 || yearsExperience > 50)
        {
            yearsExperience = 1;
        }

        return yearsExperience;
    }
}
