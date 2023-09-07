using Newtonsoft.Json;
using RIPA.Functions.Common.Models.Interfaces;
using System;

namespace RIPA.Functions.Common.Models.v2;

public class UserProfile : IUserProfile
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

    [JsonProperty(PropertyName = "gender")]
    public string Gender { get; set; }

    [JsonProperty(PropertyName = "race")]
    public string Race { get; set; }

    [JsonProperty(PropertyName = "officerNonBinary")]
    public bool OfficerNonBinary { get; set; }
}
