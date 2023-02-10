using Azure;
using Azure.Data.Tables;
using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Domain.Functions.Cities.Models
{
    public class City : ITableEntity
    {
        [JsonProperty(PropertyName = "state")]
        public string State { get; set; }
        
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "county")]
        public string County { get; set; }

        [JsonProperty(PropertyName = "deactivationDate")]
        public DateTime? DeactivationDate { get; set; }
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }
    }
}
