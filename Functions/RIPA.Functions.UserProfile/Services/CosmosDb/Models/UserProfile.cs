using Newtonsoft.Json;
using System;

namespace RIPA.Functions.UserProfile.Services.CosmosDb.Models
{
    public class UserProfile
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        //Custom ID 9 character!

        [JsonRequired]
        [JsonProperty(PropertyName = "firstName")]
        public string FirstName { get; set; }
        
        [JsonRequired]
        [JsonProperty(PropertyName = "lastName")]
        public string LastName { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { 
            get { return FirstName + " " + LastName; }             
        }

        [JsonRequired]
        [JsonProperty(PropertyName = "startDate")]
        public DateTime StartDate { get; set; }

        [JsonRequired]
        [JsonProperty(PropertyName = "agency")]
        public string Agency { get; set; }

    }

}
