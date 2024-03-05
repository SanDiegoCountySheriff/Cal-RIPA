using System.Collections.Generic;
using Newtonsoft.Json;

namespace RIPA.Functions.Common.Models;

public class PiiEntitiesResponse
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    public string EntityText { get; set; }
    public string Source { get; set; }
}