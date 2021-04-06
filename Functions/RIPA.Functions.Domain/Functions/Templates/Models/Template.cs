using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace RIPA.Functions.Domain.Functions.Templates.Models
{
    public class Template : TableEntity
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        
        [JsonProperty(PropertyName = "templateText")]
        public string TemplateText { get; set; }
    }
}
