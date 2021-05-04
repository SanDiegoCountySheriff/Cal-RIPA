using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace RIPA.Functions.Submission.Models
{
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
    }
}
