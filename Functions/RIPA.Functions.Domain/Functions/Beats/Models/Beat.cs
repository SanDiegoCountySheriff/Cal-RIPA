using Azure;
using Azure.Data.Tables;
using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Domain.Functions.Beats.Models;

public class Beat : ITableEntity
{
    [JsonProperty(PropertyName = "id")]
    public int Id { get; set; }

    [JsonProperty(PropertyName = "community")]
    public string Community { get; set; }

    [JsonProperty(PropertyName = "command")]
    public string Command { get; set; }

    [JsonProperty(PropertyName = "commandAuditGroup")]
    public string CommandAuditGroup { get; set; }

    [JsonProperty(PropertyName = "commandAuditSize")]
    public string CommandAuditSize { get; set; }
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
