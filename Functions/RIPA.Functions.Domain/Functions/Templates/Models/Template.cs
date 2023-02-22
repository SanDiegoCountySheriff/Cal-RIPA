using Azure;
using Azure.Data.Tables;
using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Domain.Functions.Templates.Models;

public class Template : ITableEntity
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    [JsonProperty(PropertyName = "displayName")]
    public string DisplayName { get; set; }
    [JsonProperty(PropertyName = "stop")]
    public string StopTemplate { get; set; }
    [JsonProperty(PropertyName = "deactivationDate")]
    public DateTime? DeactivationDate { get; set; }
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
