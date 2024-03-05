using System.Collections.Generic;
using Newtonsoft.Json;

namespace RIPA.Functions.Common.Models;

public class PiiDatabaseResponse
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    public List<PiiEntity> PiiEntities { get; set; }
    public string ReasonForStopExplanation { get; set; }
    public string BasisForSearchBrief { get; set; }
    public string Location { get; set; }
}