using Microsoft.Azure.Cosmos.Table;
using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Domain.Functions.Statutes.Models
{
    public class Statute : TableEntity
    {
        [JsonProperty(PropertyName = "offenseValidationCD")]
        public int OffenseValidationCD { get; set; }

        [JsonProperty(PropertyName = "offenseCode")]
        public int OffenseCode { get; set; }

        [JsonProperty(PropertyName = "offenseTxnTypeCD")]
        public int? OffenseTxnTypeCD { get; set; }
        
        [JsonProperty(PropertyName = "offenseStatute")]
        public string OffenseStatute { get; set; }

        [JsonProperty(PropertyName = "offenseTypeOfStatuteCD")]
        public string OffenseTypeOfStatuteCD { get; set; }

        [JsonProperty(PropertyName = "statuteLiteral")]
        public string StatuteLiteral { get; set; }

        [JsonProperty(PropertyName = "offenseDefaultTypeOfCharge")]
        public string OffenseDefaultTypeOfCharge { get; set; }

        [JsonProperty(PropertyName = "offenseTypeOfCharge")]
        public string OffenseTypeOfCharge { get; set; }

        [JsonProperty(PropertyName = "offenseLiteralIdentifierCD")]
        public string OffenseLiteralIdentifierCD { get; set; }

        [JsonProperty(PropertyName = "offenseDegree")]
        public int? OffenseDegree { get; set; }

        [JsonProperty(PropertyName = "bcsHierarchyCD")]
        public int? BCSHierarchyCD { get; set; }

        [JsonProperty(PropertyName = "offenseEnacted")]
        public DateTime OffenseEnacted { get; set; }

        [JsonProperty(PropertyName = "offenseRepealed")]
        public DateTime? OffenseRepealed { get; set; }

        [JsonProperty(PropertyName = "alpsCognizantCD")]
        public string ALPSCognizantCD { get; set; }


    }
}
