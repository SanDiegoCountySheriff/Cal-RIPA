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
using RIPA.Functions.Domain.Functions.Beats.Models;
using RIPA.Functions.Domain.Functions.Cities.Models;
using RIPA.Functions.Domain.Functions.Schools.Models;
using RIPA.Functions.Domain.Functions.Statutes.Models;
using RIPA.Functions.Security;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Upload;

public class PostUpload
{
    private readonly List<TableTransactionAction> _batch;
    private readonly int _batchLimit = 100;
    private readonly TableServiceClient _client;

    public PostUpload(TableServiceClient client)
    {
        _client = client;
        _batch = new List<TableTransactionAction>();
    }

    [FunctionName("PostUpload")]
    [OpenApiOperation(operationId: "PostUpload", tags: new[] { "name" })]
    [OpenApiSecurity("Bearer", SecuritySchemeType.OAuth2, Name = "Bearer Token", In = OpenApiSecurityLocationType.Header, Flows = typeof(RIPAAuthorizationFlow))]
    [OpenApiParameter(name: "Ocp-Apim-Subscription-Key", In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Ocp-Apim-Subscription-Key")]
    [OpenApiRequestBody(contentType: "multipart/form-data; boundary=<calculated when request is sent>", bodyType: typeof(UploadRequest), Deprecated = false, Required = true)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "Upload Complete")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: "application/json", bodyType: typeof(string), Description = "File Format Error; Please pass form-data with key: 'file' value: filepath.xslx; Sheets should be included: Beat_Table, City_Table, School_Table, and Offense_Table;")]

    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
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

    private bool IsBatchCountExecutable(int batchCount)
    {
        if (batchCount == _batchLimit)
            return true;
        return false;
    }

    private async Task<int> ProcessEntities(DataTable dataTable, TableClient table, ILogger log)
    {
        await table.CreateIfNotExistsAsync();
        int batchCount = 0;
        int totalRows = dataTable.Rows.Count - 1;
        int returnTotalRows = totalRows;

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
            PartitionKey = row.ItemArray[0].ToString(),
            State = row.ItemArray[0].ToString(),
            RowKey = row.ItemArray[1].ToString(),
            Name = row.ItemArray[1].ToString(),
            County = row.ItemArray[2].ToString(),
        };
        string inactiveDate = row.ItemArray[3].ToString();
        if (!string.IsNullOrEmpty(inactiveDate))
        {
            city.DeactivationDate = DateTime.Parse(inactiveDate);
        }
        return city;
    }

    private School GetSchool(DataRow row)
    {
        School school = new School
        {
            PartitionKey = "CA",
            RowKey = row.ItemArray[0].ToString(),
            CDSCode = row.ItemArray[0].ToString(),
            Status = row.ItemArray[3].ToString(),
            County = row.ItemArray[4].ToString(),
            District = row.ItemArray[5].ToString(),
            Name = row.ItemArray[6].ToString()
        };
        return school;
    }

    private Statute GetStatute(DataRow row)
    {
        Statute statute = new Statute
        {
            PartitionKey = "CA",
            OffenseValidationCD = Convert.ToInt32(row.ItemArray[0]),
            RowKey = row.ItemArray[1].ToString(),
            OffenseCode = Convert.ToInt32(row.ItemArray[1]),
            OffenseTxnTypeCD = Convert.ToInt32(row.ItemArray[2].ToString()),
            OffenseStatute = row.ItemArray[3].ToString(),
            OffenseTypeOfStatuteCD = row.ItemArray[4].ToString(),
            StatuteLiteral = row.ItemArray[5].ToString(),
            OffenseDefaultTypeOfCharge = row.ItemArray[6].ToString(),
            OffenseTypeOfCharge = row.ItemArray[7].ToString(),
            OffenseLiteralIdentifierCD = row.ItemArray[8].ToString()
        };
        statute.OffenseDegree = String.IsNullOrEmpty(row.ItemArray[9].ToString()) ? null : statute.OffenseDegree = Convert.ToInt32(row.ItemArray[9].ToString());
        statute.BCSHierarchyCD = String.IsNullOrEmpty(row.ItemArray[10].ToString()) ? null : statute.BCSHierarchyCD = Convert.ToInt32(row.ItemArray[10].ToString());
        string offenseEnacted = row.ItemArray[11].ToString();
        if (!string.IsNullOrEmpty(offenseEnacted))
        {
            if (offenseEnacted.Length == 8)
                statute.OffenseEnacted = DateTime.ParseExact(offenseEnacted, "yyyyMMdd", CultureInfo.InvariantCulture);
            else
                statute.OffenseEnacted = DateTime.Parse(offenseEnacted);

        }
        string offenseRepealed = row.ItemArray[12].ToString();
        if (!string.IsNullOrEmpty(offenseRepealed))
        {
            if (offenseEnacted.Length == 8)
                statute.OffenseRepealed = DateTime.ParseExact(offenseRepealed, "yyyyMMdd", CultureInfo.InvariantCulture);
            else
                statute.OffenseRepealed = DateTime.Parse(offenseRepealed);
        }
        statute.ALPSCognizantCD = row.ItemArray[13].ToString();
        return statute;
    }

    private Beat GetBeat(DataRow row)
    {
        Beat beat = new Beat
        {
            PartitionKey = "CA",
            RowKey = row.ItemArray[0].ToString(),
            Id = Convert.ToInt32(row.ItemArray[0]),
            Community = row.ItemArray[1].ToString(),
            Command = row.ItemArray[2].ToString(),
            CommandAuditGroup = row.ItemArray[3].ToString(),
            CommandAuditSize = row.ItemArray[4].ToString()
        };
        return beat;
    }

    private class UploadRequest
    {
        public string File { get; set; }
    }
}
