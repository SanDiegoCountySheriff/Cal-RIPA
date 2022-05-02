using Newtonsoft.Json;
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

        [JsonProperty(PropertyName = "startDate")]
        public DateTime StartDate { get; set; }

        [JsonProperty(PropertyName = "yearsExperience")]
        public int YearsExperience { get; set; }

        [JsonProperty(PropertyName = "officerRace")]
        public string OfficerRace { get; set; }

        [JsonProperty(PropertyName = "officerGender")]
        public string OfficerGender { get; set; }

        [JsonRequired]
        [JsonProperty(PropertyName = "agency")]
        public string Agency { get; set; }

        [JsonProperty(PropertyName = "assignment")]
        public string Assignment { get; set; }

        [JsonProperty(PropertyName = "otherType")]
        public string OtherType { get; set; }

        [JsonProperty(PropertyName = "favoriteLocations")]
        public string FavoriteLocations { get; set; }

        [JsonProperty(PropertyName = "favoriteReasons")]
        public string FavoriteReasons { get; set; }

        [JsonProperty(PropertyName = "favoriteResults")]
        public string FavoriteResults { get; set; }
    }
}
