using Azure;
using Azure.Data.Tables;
using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Domain.Functions.Schools.Models;

public class School : ITableEntity
{
    [JsonProperty(PropertyName = "cdsCode")]
    public string CDSCode { get; set; }
    [JsonProperty(PropertyName = "status")]
    public string Status { get; set; }
    [JsonProperty(PropertyName = "county")]
    public string County { get; set; }
    [JsonProperty(PropertyName = "district")]
    public string District { get; set; }
    [JsonProperty(PropertyName = "name")]
    public string Name { get; set; }
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
