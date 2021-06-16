using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace RIPA.Functions.Common.Models
{
    public class UserProfile
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        //Custom ID 9 character!
        [JsonProperty(PropertyName = "officerId")]
        public string OfficerId { get; set; }

        [JsonRequired]
        [JsonProperty(PropertyName = "firstName")]
        public string FirstName { get; set; }

        [JsonRequired]
        [JsonProperty(PropertyName = "lastName")]
        public string LastName { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name
        {
            get { return FirstName + " " + LastName; }
        }

        [JsonRequired]
        [JsonProperty(PropertyName = "startDate")]
        public DateTime StartDate { get; set; }

        [JsonRequired]
        [JsonProperty(PropertyName = "agency")]
        public string Agency { get; set; }

        [JsonProperty(PropertyName = "assignment")]
        public string Assignment { get; set; }

        [JsonProperty(PropertyName = "otherType")]
        public string OtherType { get; set; }

    }
}
