using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
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
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Functions.Upload
{
    public static class PostUpload
    {
        public static ILogger _log;
        public static TableBatchOperation _operations;

        [FunctionName("PostUpload")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            _log = log;
            var formData = await req.ReadFormAsync();
            var file = req.Form.Files["file"];

            //foreach (Sheet sheet in GetSheets(file))
            //{
            //    Console.WriteLine(sheet.Name);
            //}

            var account = CloudStorageAccount.Parse(Environment.GetEnvironmentVariable("RipaStorage"));
            var client = account.CreateCloudTableClient();
            var cities = client.GetTableReference("Cities");
            await ReadExcelDOM(file, "City_Table", cities);
            var schools = client.GetTableReference("Schools");
            await ReadExcelDOM(file, "School_Table", schools);
            var statutes = client.GetTableReference("Statutes");
            await ReadExcelDOM(file, "Offense Table", statutes);

            string responseMessage = $"Processed file";

            return new OkObjectResult(responseMessage);
        }

        public async static Task<bool> ReadExcelDOM(IFormFile file, String sheetName, CloudTable table)
        {
            using (SpreadsheetDocument document = SpreadsheetDocument.Open(file.OpenReadStream(), false))
            {
                WorkbookPart workbookPart = document.WorkbookPart;
                Sheet sheet = workbookPart.Workbook.Descendants<Sheet>().
                Where(s => s.Name == sheetName).FirstOrDefault();

                if (sheet == null)
                {
                    throw new ArgumentException("sheetName");
                }

                WorksheetPart worksheetPart = (WorksheetPart)(workbookPart.GetPartById(sheet.Id));
                _operations = new TableBatchOperation();
                
                int count = 0;
                foreach (Row r in worksheetPart.Worksheet.Descendants<Row>().Where(r => r.RowIndex != 1))
                {
                    count++;
                    if (count == 100)
                    {
                        try
                        {
                            await table.ExecuteBatchAsync(_operations);
                        }
                        catch (Exception ex)
                        {
                            _log.LogError($"batch failed {ex.Message}");
                        }
                        _operations = new TableBatchOperation();
                        count = 0;
                        Console.WriteLine($"processed 100 {r.RowIndex}");
                    }

                    switch (sheetName)
                    {
                        case "City_Table":
                            UpsertCity(worksheetPart, workbookPart, r.RowIndex, table, sheetName, r);
                            break;
                        case "School_Table":
                            UpsertSchool(worksheetPart, workbookPart, r.RowIndex, table, sheetName);
                            break;
                        case "Offense Table":
                            UpsertOffense(worksheetPart, workbookPart, r.RowIndex, table, sheetName);
                            break;
                        default:
                            break;
                    }
                }
                try
                {
                    await table.ExecuteBatchAsync(_operations);
                }
                catch (Exception ex)
                {
                    _log.LogError($"batch failed {ex.Message}");
                }
            }
            return true;
        }

        public static Sheets GetSheets(IFormFile file)
        {
            Sheets sheets;

            using (SpreadsheetDocument doc = SpreadsheetDocument.Open(file.OpenReadStream(), false))
            {
                WorkbookPart wbPart = doc.WorkbookPart;
                sheets = wbPart.Workbook.Sheets;
            }

            return sheets;
        }

        public static string GetCellValue(string sheetName, string addressName, WorksheetPart worksheetPart, WorkbookPart workbookPart)
        {
            string value = null;

            Cell cell = worksheetPart.Worksheet.Descendants<Cell>().
              Where(c => c.CellReference == addressName).FirstOrDefault();

            if (cell.InnerText.Length > 0)
            {
                value = cell.InnerText;

                if (cell.DataType != null)
                {
                    switch (cell.DataType.Value)
                    {
                        case CellValues.SharedString:

                            var stringTable =
                                workbookPart.GetPartsOfType<SharedStringTablePart>()
                                .FirstOrDefault();

                            if (stringTable != null)
                            {
                                value =
                                    stringTable.SharedStringTable
                                    .ElementAt(int.Parse(value)).InnerText;
                            }
                            break;

                        case CellValues.Boolean:
                            switch (value)
                            {
                                case "0":
                                    value = "FALSE";
                                    break;
                                default:
                                    value = "TRUE";
                                    break;
                            }
                            break;
                    }
                }
            }

            return value;
        }

        public static void UpsertCity(WorksheetPart worksheetPart, WorkbookPart workbookPart, UInt32Value rowIndex, CloudTable table, string sheetName, Row row)
        {
            City city = new City();
            try
            {
                city.ETag = "*";
                city.PartitionKey = GetCellValue(sheetName, $"A{rowIndex}", worksheetPart, workbookPart);
                city.State = GetCellValue(sheetName, $"A{rowIndex}", worksheetPart, workbookPart);
                city.RowKey = GetCellValue(sheetName, $"B{rowIndex}", worksheetPart, workbookPart);
                city.Name = GetCellValue(sheetName, $"B{rowIndex}", worksheetPart, workbookPart);
                city.County = GetCellValue(sheetName, $"C{rowIndex}", worksheetPart, workbookPart);
                string inactiveDate = (GetCellValue(sheetName, $"D{rowIndex}", worksheetPart, workbookPart));
                if (!string.IsNullOrEmpty(inactiveDate))
                {
                    city.DeactivationDate = DateTime.FromOADate(Convert.ToDouble(inactiveDate));
                }

                var found = _operations.Where(x => x.Entity.RowKey == city.RowKey);
                if (found.Count() > 0)
                {
                    _operations.Remove(found.ToList()[0]);
                }
                _operations.InsertOrReplace(city);
            }
            catch (Exception ex)
            {
                _log.LogError($"upsert failed for object {city} exception {ex.Message}");
            }
        }

        public static void UpsertSchool(WorksheetPart worksheetPart, WorkbookPart workbookPart, UInt32Value rowIndex, CloudTable table, string sheetName)
        {
            School school = new School();
            try
            {
                school.ETag = "*";
                school.PartitionKey = "CA";
                school.RowKey = GetCellValue(sheetName, $"A{rowIndex}", worksheetPart, workbookPart);
                school.CDSCode = Convert.ToInt64(school.RowKey);
                school.Status = GetCellValue(sheetName, $"B{rowIndex}", worksheetPart, workbookPart);
                school.County = GetCellValue(sheetName, $"C{rowIndex}", worksheetPart, workbookPart);
                school.District = GetCellValue(sheetName, $"D{rowIndex}", worksheetPart, workbookPart);
                school.Name = GetCellValue(sheetName, $"E{rowIndex}", worksheetPart, workbookPart);
                //var found = operations.Where(x => x.Entity.RowKey == school.RowKey);
                //if (found.Count() > 0)
                //{
                //    operations.Remove(found.ToList()[0]);
                //}
                _operations.InsertOrReplace(school);
            }
            catch (Exception ex)
            {
                _log.LogError($"upsert failed for object {school} exception {ex.Message}");
            }
        }

        public static void UpsertOffense(WorksheetPart worksheetPart, WorkbookPart workbookPart, UInt32Value rowIndex, CloudTable table, string sheetName)
        {
            Statute statute = new Statute();
            try
            {
                statute.ETag = "*";
                statute.PartitionKey = "CA";
                statute.OffenseValidationCD = Convert.ToInt32(GetCellValue(sheetName, $"A{rowIndex}", worksheetPart, workbookPart));
                statute.RowKey = GetCellValue(sheetName, $"B{rowIndex}", worksheetPart, workbookPart);
                statute.OffenseCode = Convert.ToInt32(statute.RowKey);
                statute.OffenseTxnTypeCD = Convert.ToInt32(GetCellValue(sheetName, $"C{rowIndex}", worksheetPart, workbookPart));
                statute.OffenseStatute = GetCellValue(sheetName, $"D{rowIndex}", worksheetPart, workbookPart);
                statute.OffenseTypeOfStatuteCD = GetCellValue(sheetName, $"E{rowIndex}", worksheetPart, workbookPart);
                statute.StatuteLiteral = GetCellValue(sheetName, $"F{rowIndex}", worksheetPart, workbookPart);
                statute.OffenseDefaultTypeOfCharge = GetCellValue(sheetName, $"G{rowIndex}", worksheetPart, workbookPart);
                statute.OffenseTypeOfCharge = GetCellValue(sheetName, $"H{rowIndex}", worksheetPart, workbookPart);
                statute.OffenseLiteralIdentifierCD = GetCellValue(sheetName, $"I{rowIndex}", worksheetPart, workbookPart);
                statute.OffenseDegree = Convert.ToInt32(GetCellValue(sheetName, $"J{rowIndex}", worksheetPart, workbookPart));
                statute.BCSHierarchyCD = Convert.ToInt32(GetCellValue(sheetName, $"K{rowIndex}", worksheetPart, workbookPart));
                string offenseEnacted = GetCellValue(sheetName, $"L{rowIndex}", worksheetPart, workbookPart);
                if (!string.IsNullOrEmpty(offenseEnacted))
                {
                    statute.OffenseEnacted = DateTime.Parse(offenseEnacted);
                }
                string offenseRepealed = GetCellValue(sheetName, $"M{rowIndex}", worksheetPart, workbookPart);
                if (!string.IsNullOrEmpty(offenseRepealed))
                {
                    statute.OffenseRepealed = DateTime.Parse(offenseRepealed);
                }
                statute.ALPSCognizantCD = GetCellValue(sheetName, $"N{rowIndex}", worksheetPart, workbookPart);
                //var found = operations.Where(x => x.Entity.RowKey == statute.RowKey);
                //if (found.Count() > 0)
                //{
                //    operations.Remove(found.ToList()[0]);
                //}
                _operations.InsertOrReplace(statute);
            }
            catch (Exception ex)
            {
                _log.LogError($"upsert failed for object {statute} exception {ex.Message}");
            }
        }

    }
}

