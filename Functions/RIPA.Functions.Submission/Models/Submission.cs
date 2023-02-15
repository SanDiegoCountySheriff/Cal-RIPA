using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Submission.Models;

public class Submission
{
    [JsonRequired]
    [JsonProperty(PropertyName = "id")]
    public Guid Id { get; set; }
    [JsonRequired]
    [JsonProperty(PropertyName = "dateSubmitted")]
    public DateTime DateSubmitted { get; set; }
    [JsonProperty(PropertyName = "recordCount")]
    public int RecordCount { get; set; }
    [JsonProperty(PropertyName = "officerName")]
    public string OfficerName { get; set; }
    [JsonProperty(PropertyName = "officerId")]
    public string OfficerId { get; set; }
    [JsonProperty(PropertyName = "MinStopDate")]
    public DateTime MinStopDate { get; set; }
    [JsonProperty(PropertyName = "MaxStopDate")]
    public DateTime MaxStopDate { get; set; }
}
