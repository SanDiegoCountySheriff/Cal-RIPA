using Newtonsoft.Json;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.Utility;

namespace RIPA.Functions.Common.Models.v1;

public class Location : ILocation
{
    public bool ToggleLocationOptions { get; set; }
    public string Intersection { get; set; }
    public string BlockNumber { get; set; }
    public string LandMark { get; set; }
    public string StreetName { get; set; }
    public string HighwayExit { get; set; }
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
