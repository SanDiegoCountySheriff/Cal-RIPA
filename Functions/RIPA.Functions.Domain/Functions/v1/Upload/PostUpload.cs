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
            int successfulRecordCount = 0;
            int failedRecordCount = 0;
            var formData = await req.ReadFormAsync();
            var file = req.Form.Files["file"];

            DataSet dataSet = RunExcelDataReader(file);

            if (dataSet.Tables["Beat_Table"] != null)
            {
                var beatResult = await ProcessEntities(dataSet.Tables["Beat_Table"], _client.GetTableClient("Beats"), log);
                successfulRecordCount += beatResult.SuccessfulRows;
                failedRecordCount += beatResult.FailedRows;
            }

            var cityResult = await ProcessEntities(dataSet.Tables["City_Table"], _client.GetTableClient("Cities"), log);
            successfulRecordCount += cityResult.SuccessfulRows;
            failedRecordCount += cityResult.FailedRows;

            var schoolResult = await ProcessEntities(dataSet.Tables["School_Table"], _client.GetTableClient("Schools"), log);
            successfulRecordCount += schoolResult.SuccessfulRows;
            failedRecordCount += schoolResult.FailedRows;

            // CA DOJ currently has the table name as "Offense Table" which does not follow the conventions of the other tables
            if (dataSet.Tables["Offense_Table"] != null)
            {
                var statuteResult = await ProcessEntities(dataSet.Tables["Offense_Table"], _client.GetTableClient("Statutes"), log);
                successfulRecordCount += statuteResult.SuccessfulRows;
                failedRecordCount += statuteResult.FailedRows;
            }
            else if (dataSet.Tables["Offense Table"] != null)
            {
                var statuteResult = await ProcessEntities(dataSet.Tables["Offense Table"], _client.GetTableClient("Statutes"), log);
                successfulRecordCount += statuteResult.SuccessfulRows;
                failedRecordCount += statuteResult.FailedRows;
            }

            string responseMessage;

            if (successfulRecordCount >= 1)
            {
                responseMessage = $"Upload complete: {successfulRecordCount} {(successfulRecordCount > 1 ? "records" : "record")} updated.";
                if (failedRecordCount > 0)
                {
                    responseMessage += $" {failedRecordCount} {(failedRecordCount > 1 ? "records" : "record")} failed and were skipped.";
                }
            }
            else
            {
                responseMessage = failedRecordCount > 0
                    ? $"Upload failed: 0 records updated. {failedRecordCount} {(failedRecordCount > 1 ? "records" : "record")} failed validation."
                    : "No records found";
            }

            if (successfulRecordCount > 0)
            {
                await _domainCosmosDbService.SetDomainUploadDate(DateTime.Now.Date);
            }

            if (successfulRecordCount == 0 && failedRecordCount > 0)
            {
                return new BadRequestObjectResult(responseMessage);
            }

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
        { "OFFENSE_REPEALED", "OFFENSE REPEALED" },
        { "OFFENSE_REPEALED_OR_INACTIVATED", "OFFENSE REPEALED" },
        { "ALPCCOGN_CD", "ALPS COGNIZANT CD" },
    };

    private readonly Dictionary<string, string> ExpectedCityHeaders = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { "INACTIVE_DATE", "INACTIVE DATE" },
    };

    private readonly Dictionary<string, string> ExpectedSchoolHeaders = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { "CDS_CODE", "CDSCODE" },
        { "STATUS TYPE", "STATUSTYPE" },
        { "STATUS_TYPE", "STATUSTYPE" },
        { "STATUSTY", "STATUSTYPE" },
    };

    private readonly Dictionary<string, string> ExpectedBeatHeaders = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { "COMMAND_AUDIT_GROUP", "COMMANDAUDITGROUP" },
        { "COMMAND_AUDIT_SIZE", "COMMANDAUDITSIZE" },
    };

    private readonly Dictionary<string, List<string>> RequiredHeadersByTable = new Dictionary<string, List<string>>(StringComparer.OrdinalIgnoreCase)
    {
        { "Beats", new List<string> { "ID", "COMMUNITY", "COMMAND" } },
        { "Cities", new List<string> { "STATE", "CITY", "COUNTY" } },
        { "Schools", new List<string> { "CDSCODE", "STATUSTYPE", "COUNTY", "DISTRICT", "SCHOOL" } },
        { "Statutes", new List<string>
            {
                "OFFENSE VALIDATION CD",
                "OFFENSE CODE",
                "OFFENSE TXN TYPE CD",
                "OFFENSE STATUTE",
                "OFFENSE TYPE OF STATUTE CD",
                "STATUTE LITERAL 25",
                "OFFENSE DEFAULT TYPE OF CHARGE",
                "OFFENSE TYPE OF CHARGE",
                "OFFENSE LITERAL IDENTIFIER CD",
                "OFFENSE DEGREE",
                "BCS HIERARCHY CD",
                "OFFENSE ENACTED",
                "OFFENSE REPEALED",
                "ALPS COGNIZANT CD",
            }
        },
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

    private async Task<(int SuccessfulRows, int FailedRows)> ProcessEntities(DataTable dataTable, TableClient table, ILogger log)
    {
        await table.CreateIfNotExistsAsync();
        int successfulRows = 0;
        int failedRows = 0;

        _batch.Clear();

        if (dataTable.Rows.Count == 0)
        {
            return (0, 0);
        }

        foreach (DataRow row in dataTable.Rows.Cast<DataRow>().Take(1))
        {

            var headers = row.ItemArray
                .Select(columnName => columnName.ToString().ToUpper().Trim()).ToList();

            NormalizeHeaders(headers, GetExpectedHeadersForTable(table.Name));
            ValidateRequiredHeaders(table.Name, headers);

            switch (table.Name)
            {
                case "Beats":
                    BeatTableHeaders.Clear();
                    BeatTableHeaders.AddRange(headers);
                    break;
                case "Cities":
                    CityTableHeaders.Clear();
                    CityTableHeaders.AddRange(headers);
                    break;
                case "Schools":
                    SchoolTableHeaders.Clear();
                    SchoolTableHeaders.AddRange(headers);
                    break;
                case "Statutes":
                    StatuteTableHeaders.Clear();
                    StatuteTableHeaders.AddRange(headers);
                    break;
                default:
                    break;
            }
        }

        int rowNumber = 1;
        foreach (DataRow row in dataTable.Rows.Cast<DataRow>().Skip(1))
        {
            rowNumber++;

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

                if (IsBatchCountExecutable(_batch.Count))
                {
                    bool batchSucceeded = await ExecuteBatch(table, log);
                    if (batchSucceeded)
                    {
                        successfulRows += _batch.Count;
                    }
                    else
                    {
                        failedRows += _batch.Count;
                    }

                    _batch.Clear();
                }
            }
            catch (Exception ex)
            {
                failedRows++;
                log.LogError(ex, "Failed processing {tableName} row {rowNumber}", table.Name, rowNumber);
            }
        }

        if (_batch.Count > 0)
        {
            bool batchSucceeded = await ExecuteBatch(table, log);
            if (batchSucceeded)
            {
                successfulRows += _batch.Count;
            }
            else
            {
                failedRows += _batch.Count;
            }

            _batch.Clear();
        }

        return (successfulRows, failedRows);
    }

    private Dictionary<string, string> GetExpectedHeadersForTable(string tableName)
    {
        switch (tableName)
        {
            case "Beats":
                return ExpectedBeatHeaders;
            case "Cities":
                return ExpectedCityHeaders;
            case "Schools":
                return ExpectedSchoolHeaders;
            case "Statutes":
                return ExpectedStatuteHeaders;
            default:
                return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        }
    }

    private void ValidateRequiredHeaders(string tableName, List<string> headers)
    {
        if (!RequiredHeadersByTable.TryGetValue(tableName, out var requiredHeaders))
        {
            return;
        }

        var missingHeaders = requiredHeaders.Where(requiredHeader => !headers.Contains(requiredHeader)).ToList();
        if (missingHeaders.Count > 0)
        {
            throw new InvalidOperationException($"Missing required headers for {tableName}: {string.Join(", ", missingHeaders)}");
        }
    }

    private City GetCity(DataRow row)
    {
        int inactiveDateIndex = CityTableHeaders.IndexOf("INACTIVE DATE");

        City city = new City
        {
            PartitionKey = row.ItemArray[CityTableHeaders.IndexOf("STATE")].ToString(),
            State = row.ItemArray[CityTableHeaders.IndexOf("STATE")].ToString(),
            RowKey = row.ItemArray[CityTableHeaders.IndexOf("CITY")].ToString(),
            Name = row.ItemArray[CityTableHeaders.IndexOf("CITY")].ToString(),
            County = row.ItemArray[CityTableHeaders.IndexOf("COUNTY")].ToString(),
        };

        if (inactiveDateIndex != -1)
        {
            string inactiveDate = row.ItemArray[inactiveDateIndex].ToString();

            if (!string.IsNullOrEmpty(inactiveDate))
            {
                DateTime unspecified = DateTime.Parse(inactiveDate, CultureInfo.InvariantCulture);
                city.DeactivationDate = DateTime.SpecifyKind(unspecified, DateTimeKind.Utc);
            }
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
            if (offenseEnacted.Length == 8 && offenseRepealed != "99999999")
            {
                var unspecified = DateTime.ParseExact(offenseRepealed, "yyyyMMdd", CultureInfo.InvariantCulture);
                statute.OffenseRepealed = DateTime.SpecifyKind(unspecified, DateTimeKind.Utc);
            }
            else if (offenseRepealed != "99999999")
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
