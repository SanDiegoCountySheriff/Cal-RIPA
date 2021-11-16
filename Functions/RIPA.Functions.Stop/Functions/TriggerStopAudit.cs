//using Microsoft.Azure.Documents;
//using Microsoft.Azure.WebJobs;
//using Microsoft.Extensions.Logging;
//using Newtonsoft.Json;
//using RIPA.Functions.Stop.Services.Contracts;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace RIPA.Functions.Stop.Functions
//{
//    public class TriggerStopAudit
//    {
//        private readonly IStopAuditCosmosDbService _stopAuditCosmosDbService;

//        public TriggerStopAudit(IStopAuditCosmosDbService stopAuditCosmosDbService)
//        {
//            _stopAuditCosmosDbService = stopAuditCosmosDbService;
//        }

//        [FunctionName("TriggerStopAudit")]
//        public async Task Run(
//            [CosmosDBTrigger(databaseName: "ripastops", collectionName: "stop",ConnectionStringSetting = "CosmosConnectionString", LeaseCollectionName = "leases", CreateLeaseCollectionIfNotExists = true)]
//            IReadOnlyList<Document> input, ILogger log
//        )
//        {
//            if (input != null && input.Count > 0)
//            {
//                foreach (Document document in input)
//                {
//                    Common.Models.Stop stop = JsonConvert.DeserializeObject<Common.Models.Stop>(document.ToString());
//                    stop.Id = $"{stop.Id}-{DateTime.UtcNow:yyyyMMddHHmmss}";
//                    await _stopAuditCosmosDbService.UpdateStopAuditAsync(stop.Id, stop);
//                    log.LogInformation($"Archived stop id: {document.Id}");
//                }
//            }
//        }
//    }
//}
