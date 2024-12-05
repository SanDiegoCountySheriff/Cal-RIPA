using Azure.Data.Tables;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Domain.Functions.v1.Beats.Models;
using RIPA.Functions.Domain.Functions.v1.Cities.Models;
using RIPA.Functions.Domain.Functions.v1.Schools.Models;
using RIPA.Functions.Domain.Functions.v1.Statutes.Models;
using RIPA.Functions.Domain.Services.Contracts;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.v1.Upload;

public class PostUpload
{
    private List<TableTransactionAction> _batch;
    private readonly int _batchLimit = 100;
    private readonly TableServiceClient _client;
    private readonly List<string> BeatTableHeaders;
    private readonly List<string> CityTableHeaders;
    private readonly List<string> SchoolTableHeaders;
    private readonly List<string> StatuteTableHeaders;
    private readonly IDomainCosmosDbService _domainCosmosDbService;

    public PostUpload(TableServiceClient client, IDomainCosmosDbService domainCosmosDbService)
    {
        _client = client;
        _batch = new List<TableTransactionAction>();
        BeatTableHeaders = new List<string>();
        CityTableHeaders = new List<string>();
        SchoolTableHeaders = new List<string>();
        StatuteTableHeaders = new List<string>();
        _domainCosmosDbService = domainCosmosDbService;
    }

    [FunctionName("PostUpload_v1")]
    [OpenApiOperation(operationId: "v1/PostUpload", tags: new[] { "name", "v1" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiRequestBody(contentType: "multipart/form-data; boundary=<calculated when request is sent>", bodyType: typeof(UploadRequest), Deprecated = false, Required = true)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Upload Complete")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "File Format Error; Please pass form-data with key: 'file' value: filepath.xslx; Sheets should be included: Beat_Table, City_Table, School_Table, and Offense_Table;")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/PostUpload")] HttpRequest req, ILogger log)
    {
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
            int recordCount = 0;
            var formData = await req.ReadFormAsync();
            var file = req.Form.Files["file"];

            DataSet dataSet = RunExcelDataReader(file);

            if (dataSet.Tables["Beat_Table"] != null)
            {
                recordCount += await ProcessEntities(dataSet.Tables["Beat_Table"], _client.GetTableClient("Beats"), log);
            }

            recordCount += await ProcessEntities(dataSet.Tables["City_Table"], _client.GetTableClient("Cities"), log);
            recordCount += await ProcessEntities(dataSet.Tables["School_Table"], _client.GetTableClient("Schools"), log);

            // CA DOJ currently has the table name as "Offense Table" which does not follow the conventions of the other tables
            if (dataSet.Tables["Offense_Table"] != null)
            {
                recordCount += await ProcessEntities(dataSet.Tables["Offense_Table"], _client.GetTableClient("Statutes"), log);
            }
            else if (dataSet.Tables["Offense Table"] != null)
            {
                recordCount += await ProcessEntities(dataSet.Tables["Offense Table"], _client.GetTableClient("Statutes"), log);
            }

            string responseMessage;

            if (recordCount >= 1)
            {
                responseMessage = $"Upload complete: {recordCount} {(recordCount > 1 ? "records" : "record")} updated.";
            }
            else
            {
                responseMessage = "No records found";
            }

            await _domainCosmosDbService.SetDomainUploadDate(DateTime.Now.Date);

            return new OkObjectResult(responseMessage);
        }
        catch (Exception ex)
        {
            log.LogError(ex.Message);
            return new BadRequestObjectResult("File Format Error.  Sheets should be included: City_Table, School_Table, and Offense_Table");
        }
    }

    private DataSet RunExcelDataReader(IFormFile file)
    {
        IExcelDataReader reader = ExcelReaderFactory.CreateReader(file.OpenReadStream());
        DataSet dataSet = reader.AsDataSet();

        return dataSet;
    }

    private readonly Dictionary<string, string> ExpectedStatuteHeaders = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { "OFFENSE_VALIDATION_CD", "OFFENSE VALIDATION CD" },
        { "OFFENSE_CD", "OFFENSE CODE" },
        { "TXN_TYPE_CD", "OFFENSE TXN TYPE CD" },
        { "OFFENSE_STATUTE", "OFFENSE STATUTE" },
        { "OFFENSE_TYPE_OF_STAT_CD", "OFFENSE TYPE OF STATUTE CD" },
        { "OFFENSE_LITERAL", "STATUTE LITERAL 25" },
        { "DEF_TYPE_OF_CHARGE", "OFFENSE DEFAULT TYPE OF CHARGE" },
        { "OFFENSE_TYPE_OF_CHARGE", "OFFENSE TYPE OF CHARGE" },
        { "LITERAL_ID_CD", "OFFENSE LITERAL IDENTIFIER CD" },
        { "DEGREE", "OFFENSE DEGREE" },
        { "BCS_HIE_CD", "BCS HIERARCHY CD" },
        { "OFFENSE_ENACTED", "OFFENSE ENACTED" },
        { "OFFENSE_REPEALED_OR_ INACTIVATED", "OFFENSE REPEALED" },
        { "ALPCCOGN_CD", "ALPS COGNIZANT CD" },
    };

    private async Task<bool> ExecuteBatch(TableClient table, ILogger log)
    {
        try
        {
            await table.SubmitTransactionAsync(_batch);
        }
        catch (Exception ex)
        {
            log.LogError($"batch failed {ex.Message}");
            return false;
        }

        return true;
    }

    private void DeduplicateBatch()
    {
        _batch = _batch.GroupBy(e => e.Entity.RowKey).Select(e => e.First()).ToList();
    }

    private bool IsBatchCountExecutable(int batchCount)
    {
        return batchCount == _batchLimit;
    }

    private async Task<int> ProcessEntities(DataTable dataTable, TableClient table, ILogger log)
    {
        await table.CreateIfNotExistsAsync();
        int batchCount = 0;
        int totalRows = dataTable.Rows.Count - 1;
        int returnTotalRows = totalRows;

        foreach (DataRow row in dataTable.Rows.Cast<DataRow>().Take(1))
        {

            var headers = row.ItemArray
                .Select(columnName => columnName.ToString().ToUpper().Trim()).ToList();

            NormalizeHeaders(headers, ExpectedStatuteHeaders);

            switch (table.Name)
            {
                case "Beats":
                    BeatTableHeaders.AddRange(headers);
                    break;
                case "Cities":
                    CityTableHeaders.AddRange(headers);
                    break;
                case "Schools":
                    SchoolTableHeaders.AddRange(headers);
                    break;
                case "Statutes":
                    StatuteTableHeaders.AddRange(headers);
                    break;
                default:
                    break;
            }
        }

        foreach (DataRow row in dataTable.Rows.Cast<DataRow>().Skip(1))
        {
            totalRows--;
            batchCount++;

            if (IsBatchCountExecutable(batchCount))
            {
                await ExecuteBatch(table, log);
                _batch.Clear();
                batchCount = 0;
                Console.WriteLine($"processed {_batchLimit} - " + Environment.NewLine + $"{totalRows}");
            }

            try
            {
                switch (table.Name)
                {
                    case "Cities":
                        _batch.Add(new TableTransactionAction(TableTransactionActionType.UpsertReplace, GetCity(row)));
                        break;
                    case "Schools":
                        _batch.Add(new TableTransactionAction(TableTransactionActionType.UpsertReplace, GetSchool(row)));
                        break;
                    case "Statutes":
                        _batch.Add(new TableTransactionAction(TableTransactionActionType.UpsertReplace, GetStatute(row)));
                        break;
                    case "Beats":
                        _batch.Add(new TableTransactionAction(TableTransactionActionType.UpsertReplace, GetBeat(row)));
                        break;
                    default:
                        break;
                }

                DeduplicateBatch();
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
            }
        }

        await ExecuteBatch(table, log);
        _batch.Clear();

        return returnTotalRows;
    }

    private City GetCity(DataRow row)
    {
        City city = new City
        {
            PartitionKey = row.ItemArray[CityTableHeaders.IndexOf("STATE")].ToString(),
            State = row.ItemArray[CityTableHeaders.IndexOf("STATE")].ToString(),
            RowKey = row.ItemArray[CityTableHeaders.IndexOf("CITY")].ToString(),
            Name = row.ItemArray[CityTableHeaders.IndexOf("CITY")].ToString(),
            County = row.ItemArray[CityTableHeaders.IndexOf("COUNTY")].ToString(),
        };
        string inactiveDate = row.ItemArray[CityTableHeaders.IndexOf("INACTIVE DATE")].ToString();
        if (!string.IsNullOrEmpty(inactiveDate))
        {
            DateTime unspecified = DateTime.Parse(inactiveDate, CultureInfo.InvariantCulture);
            city.DeactivationDate = DateTime.SpecifyKind(unspecified, DateTimeKind.Utc);
        }

        return city;
    }

    private School GetSchool(DataRow row)
    {
        School school = new School
        {
            PartitionKey = "CA",
            RowKey = row.ItemArray[SchoolTableHeaders.IndexOf("CDSCODE")].ToString(),
            CDSCode = row.ItemArray[SchoolTableHeaders.IndexOf("CDSCODE")].ToString(),
            Status = row.ItemArray[SchoolTableHeaders.IndexOf("STATUSTYPE")].ToString(),
            County = row.ItemArray[SchoolTableHeaders.IndexOf("COUNTY")].ToString(),
            District = row.ItemArray[SchoolTableHeaders.IndexOf("DISTRICT")].ToString(),
            Name = row.ItemArray[SchoolTableHeaders.IndexOf("SCHOOL")].ToString()
        };

        return school;
    }

    private Statute GetStatute(DataRow row)
    {
        Statute statute = new Statute
        {
            PartitionKey = "CA",
            OffenseValidationCD = Convert.ToInt32(row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE VALIDATION CD")].ToString()),
            RowKey = row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE CODE")].ToString(),
            OffenseCode = Convert.ToInt32(row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE CODE")].ToString()),
            OffenseTxnTypeCD = string.IsNullOrEmpty(row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE TXN TYPE CD")].ToString()) ? 0 : Convert.ToInt32(row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE TXN TYPE CD")].ToString()),
            OffenseStatute = row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE STATUTE")].ToString(),
            OffenseTypeOfStatuteCD = row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE TYPE OF STATUTE CD")].ToString(),
            StatuteLiteral = row.ItemArray[StatuteTableHeaders.IndexOf("STATUTE LITERAL 25")].ToString(),
            OffenseDefaultTypeOfCharge = row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE DEFAULT TYPE OF CHARGE")].ToString(),
            OffenseTypeOfCharge = row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE TYPE OF CHARGE")].ToString(),
            OffenseLiteralIdentifierCD = row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE LITERAL IDENTIFIER CD")].ToString()
        };
        statute.OffenseDegree = string.IsNullOrEmpty(row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE DEGREE")].ToString()) ? null : statute.OffenseDegree = Convert.ToInt32(row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE DEGREE")].ToString());
        statute.BCSHierarchyCD = string.IsNullOrEmpty(row.ItemArray[StatuteTableHeaders.IndexOf("BCS HIERARCHY CD")].ToString()) ? null : statute.BCSHierarchyCD = Convert.ToInt32(row.ItemArray[StatuteTableHeaders.IndexOf("BCS HIERARCHY CD")].ToString());
        string offenseEnacted = row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE ENACTED")].ToString();

        if (!string.IsNullOrEmpty(offenseEnacted))
        {
            if (offenseEnacted.Length == 8)
            {
                var unspecified = DateTime.ParseExact(offenseEnacted, "yyyyMMdd", CultureInfo.InvariantCulture);
                statute.OffenseEnacted = DateTime.SpecifyKind(unspecified, DateTimeKind.Utc);
            }
            else
            {
                var unspecified = DateTime.Parse(offenseEnacted);
                statute.OffenseEnacted = DateTime.SpecifyKind(unspecified, DateTimeKind.Utc);
            }

        }

        string offenseRepealed = row.ItemArray[StatuteTableHeaders.IndexOf("OFFENSE REPEALED")].ToString();

        if (!string.IsNullOrEmpty(offenseRepealed))
        {
            if (offenseEnacted.Length == 8)
            {
                var unspecified = DateTime.ParseExact(offenseRepealed, "yyyyMMdd", CultureInfo.InvariantCulture);
                statute.OffenseRepealed = DateTime.SpecifyKind(unspecified, DateTimeKind.Utc);
            }
            else
            {
                var unspecified = DateTime.Parse(offenseRepealed);
                statute.OffenseRepealed = DateTime.SpecifyKind(unspecified, DateTimeKind.Utc);
            }
        }

        statute.ALPSCognizantCD = row.ItemArray[StatuteTableHeaders.IndexOf("ALPS COGNIZANT CD")].ToString();

        return statute;
    }

    private Beat GetBeat(DataRow row)
    {
        Beat beat = new Beat
        {
            PartitionKey = "CA",
            RowKey = row.ItemArray[BeatTableHeaders.IndexOf("ID")].ToString(),
            Id = row.ItemArray[BeatTableHeaders.IndexOf("ID")].ToString(),
            Community = row.ItemArray[BeatTableHeaders.IndexOf("COMMUNITY")].ToString(),
            Command = row.ItemArray[BeatTableHeaders.IndexOf("COMMAND")].ToString(),
        };

        if (BeatTableHeaders.IndexOf("COMMANDAUDITGROUP") != -1)
        {
            beat.CommandAuditGroup = row.ItemArray[BeatTableHeaders.IndexOf("COMMANDAUDITGROUP")].ToString();
        }


        if (BeatTableHeaders.IndexOf("COMMANDAUDITSIZE") != -1)
        {
            beat.CommandAuditSize = row.ItemArray[BeatTableHeaders.IndexOf("COMMANDAUDITSIZE")].ToString();
        }

        return beat;
    }

    private void NormalizeHeaders(List<string> headers, Dictionary<string, string> expectedHeaders)
    {
        for (int i = 0; i < headers.Count; i++)
        {
            string header = headers[i].ToUpper().Trim();

            if (expectedHeaders.ContainsKey(header))
            {
                headers[i] = expectedHeaders[header];
            }
        }
    }

    private class UploadRequest
    {
        public string File { get; set; }
    }
}
