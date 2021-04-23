using Newtonsoft.Json;

namespace RIPA.Functions.Statute.Services.CosmosDb.Models
{
    public class Statute
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "statuteText")]
        public string StatuteText { get; set; }

    }
}
