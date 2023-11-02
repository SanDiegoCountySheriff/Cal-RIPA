using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.Utility;
using Newtonsoft.Json;

namespace RIPA.Functions.Common.Models.v2;

public class Location : ILocation
{
    public bool ToggleLocationOptions { get; set; }
    [JsonProperty("crossStreet1")]
    public string CrossStreet1 { get; set; }
    [JsonProperty("crossStreet2")]
    public string CrossStreet2 { get; set; }
    public string BlockNumber { get; set; }
    public string LandMark { get; set; }
    public string StreetName { get; set; }
    public string Highway { get; set; }
    [JsonConverter(typeof(ConcreteConverter<City>))]
    public string Exit { get; set; }
    [JsonConverter(typeof(ConcreteConverter<City>))]
    public ICity City { get; set; }
    [JsonConverter(typeof(ConcreteConverter<Beat>))]
    public IBeat Beat { get; set; }
    public bool School { get; set; }
    [JsonConverter(typeof(ConcreteConverter<SchoolName>))]
    public ISchoolName SchoolName { get; set; }
    public bool OutOfCounty { get; set; }
    public bool PiiFound { get; set; }
    [JsonConverter(typeof(ConcreteConverter<GeoLocation>))]
    public IGeoLocation GeoLocation { get; set; }
}
