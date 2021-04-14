using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using RIPA.Functions.Domain.Functions.Cities.Models;
using RIPA.Functions.Domain.Functions.Schools.Models;
using RIPA.Functions.Domain.Functions.Statutes.Models;
using System;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Upload
{
    public static class PostUpload
    {
        public static ILogger _log;
        public static TableBatchOperation _operations;
        public static int _batchLimit = 100;

        [FunctionName("PostUpload")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            _log = log;
            var formData = await req.ReadFormAsync();
            var file = req.Form.Files["file"];

            var account = CloudStorageAccount.Parse(Environment.GetEnvironmentVariable("RipaStorage"));
            var client = account.CreateCloudTableClient();

            DataSet dataSet = RunExcelDataReader(file);
            await ProcessEntities(dataSet.Tables["City_Table"], client.GetTableReference("Cities"));

            await ProcessEntities(dataSet.Tables["School_Table"], client.GetTableReference("Schools"));

            await ProcessEntities(dataSet.Tables["Offense Table"], client.GetTableReference("Statutes"));

            string responseMessage = $"Processed file";

            return new OkObjectResult(responseMessage);
        }

        public static DataSet RunExcelDataReader(IFormFile file)
        {
            IExcelDataReader reader = ExcelReaderFactory.CreateReader(file.OpenReadStream());
            DataSet dataSet = reader.AsDataSet();

            return dataSet;
        }

        public static async Task<bool> ExecuteBatch(CloudTable table)
        {
            try
            {
                await table.ExecuteBatchAsync(_operations);
            }
            catch (Exception ex)
            {
                _log.LogError($"batch failed {ex.Message}");
                return false;
            }
            _operations = new TableBatchOperation();
            return true;
        }

        public static bool IsBatchCountExecutable(int batchCount)
        {
            if (batchCount == _batchLimit)
                return true;
            return false;

        }

        public static void DeduplicateBatch(TableEntity obj)
        {
            if (_operations.Any(x => x.Entity.RowKey == obj.RowKey))
            {
                _operations.Remove(_operations.First(x => x.Entity.RowKey == obj.RowKey));
            }
        }

        public async static Task<bool> ProcessEntities(DataTable dataTable, CloudTable table)
        {
            int batchCount = 0;
            int totalRows = dataTable.Rows.Count - 1;
            _operations = new TableBatchOperation();
            foreach (DataRow row in dataTable.Rows.Cast<DataRow>().Skip(1))
            {
                totalRows--;
                batchCount++;
                if (IsBatchCountExecutable(batchCount))
                {
                    await ExecuteBatch(table);
                    batchCount = 0;
                    Console.WriteLine($"processed {_batchLimit} - " + Environment.NewLine + $"{totalRows}");
                }

                try
                {
                    var entity = new TableEntity();
                    switch (table.Name)
                    {
                        case "Cities":
                            entity = GetCity(row);
                            break;
                        case "Schools":
                            entity = GetSchool(row);
                            break;
                        case "Statutes":
                            entity = GetStatute(row);
                            break;
                        default:
                            break;
                    }

                    DeduplicateBatch(entity);
                    _operations.InsertOrReplace(entity);
                }
                catch (Exception ex)
                {
                    _log.LogError(ex.Message);
                }
            }

            await ExecuteBatch(table);
            return true;
        }

        public static City GetCity(DataRow row)
        {
            City city = new City();
            city.ETag = "*";
            city.PartitionKey = row.ItemArray[0].ToString();
            city.State = row.ItemArray[0].ToString();
            city.RowKey = row.ItemArray[1].ToString();
            city.Name = row.ItemArray[1].ToString();
            city.County = row.ItemArray[2].ToString();
            string inactiveDate = row.ItemArray[3].ToString();
            if (!string.IsNullOrEmpty(inactiveDate))
            {
                city.DeactivationDate = DateTime.Parse(inactiveDate);
            }
            return city;
        }

        public static School GetSchool(DataRow row)
        {
            School school = new School();
            school.ETag = "*";
            school.PartitionKey = "CA";
            school.RowKey = row.ItemArray[0].ToString();
            school.CDSCode = Convert.ToInt64(school.RowKey);
            school.Status = row.ItemArray[1].ToString();
            school.County = row.ItemArray[2].ToString();
            school.District = row.ItemArray[3].ToString();
            school.Name = row.ItemArray[04].ToString();
            return school;
        }

        public static Statute GetStatute(DataRow row)
        {
            Statute statute = new Statute();
            statute.ETag = "*";
            statute.PartitionKey = "CA";
            statute.OffenseValidationCD = Convert.ToInt32(row.ItemArray[0]);
            statute.RowKey = row.ItemArray[1].ToString();
            statute.OffenseCode = Convert.ToInt32(statute.RowKey);
            statute.OffenseTxnTypeCD = Convert.ToInt32(row.ItemArray[2].ToString());
            statute.OffenseStatute = row.ItemArray[3].ToString();
            statute.OffenseTypeOfStatuteCD = row.ItemArray[4].ToString();
            statute.StatuteLiteral = row.ItemArray[5].ToString();
            statute.OffenseDefaultTypeOfCharge = row.ItemArray[6].ToString();
            statute.OffenseTypeOfCharge = row.ItemArray[7].ToString();
            statute.OffenseLiteralIdentifierCD = row.ItemArray[8].ToString();
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
    }
}

