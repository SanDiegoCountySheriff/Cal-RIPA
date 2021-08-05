using Microsoft.Azure.Cosmos.Table;
using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Domain.Functions.Cities.Models
{
    public class City : TableEntity
    {
        [JsonProperty(PropertyName = "state")]
        public string State { get; set; }
        
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "county")]
        public string County { get; set; }

        [JsonProperty(PropertyName = "deactivationDate")]
        public DateTime? DeactivationDate { get; set; }
    }
}
