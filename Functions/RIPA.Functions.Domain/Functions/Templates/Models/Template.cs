using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models;
using System;

namespace RIPA.Functions.Domain.Functions.Templates.Models
{
    public class Template : TableEntity
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        
        [JsonProperty(PropertyName = "displayName")]
        public string DisplayName { get; set; }
        
        [JsonProperty(PropertyName = "stop")]
        public Stop Stop { get; set; }

        [JsonProperty(PropertyName = "deactivationDate")]
        public DateTime? DeactivationDate { get; set; }

    }
}
