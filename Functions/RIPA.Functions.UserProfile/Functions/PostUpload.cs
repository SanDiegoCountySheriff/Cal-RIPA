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

namespace RIPA.Functions.UserProfile.Functions
{
    public class PostUpload
    {
        private readonly IUserProfileCosmosDbService _userProfileCosmosDbService;

        public PostUpload(IUserProfileCosmosDbService userProfileCosmosDbService)
        {
            _userProfileCosmosDbService = userProfileCosmosDbService;
        }

        [FunctionName("PostUpload")]
        [OpenApiOperation(operationId: "PostUpload", tags: new[] { "name" })]
        [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
        [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
        [OpenApiRequestBody(contentType: "multipart/form-data; boundary=<calculated when request is sent>", bodyType: typeof(string), Deprecated = false, Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Upload Complete")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "File Format Error; Please pass form-data with key: 'file' value: filepath.csv")]

        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
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
                    var records = csv.GetRecords<Common.Models.UserProfile>().ToList();
                    count = records.Count();

                    foreach (var record in records)
                    {
                        record.StartDate = DateTime.Now.AddYears(-record.YearsExperience);
                        if (string.IsNullOrEmpty(record.Agency))
                        {
                            record.Agency = agency;
                        }
                        await _userProfileCosmosDbService.UpdateUserProfileAsync(record.Id, record);
                        log.LogInformation($"OfficerId: {record.OfficerId} added to database");
                    }
                }

                string responseMessage = $"Upload Complete: {count} record(s) uploaded";

                log.LogInformation(responseMessage);
                return new OkObjectResult(count);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new BadRequestObjectResult("File Format Error; Please pass form-data with key: 'file' value: filepath.csv");
            }
        }
    }

    public class UserProfileMap : ClassMap<Common.Models.UserProfile>
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
}
