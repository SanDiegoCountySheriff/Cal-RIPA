using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Templates.Services.CosmosDb.Models
{
    public class Template
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonRequired]
        [JsonProperty(PropertyName = "templateText")]
        public string TemplateText { get; set; }
    }
}
