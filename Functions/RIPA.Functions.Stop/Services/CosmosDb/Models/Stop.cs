using Newtonsoft.Json;

namespace RIPA.Functions.Stop.Services.CosmosDb.Models
{
    public class Stop
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "stopText")]
        public string StopText { get; set; }

    }
}
