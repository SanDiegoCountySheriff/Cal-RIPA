using RIPA.Functions.Common.Models.Interfaces;

namespace RIPA.Functions.Common.Models.v2;

public class Location : ILocation
{
    public bool ToggleLocationOptions { get; set; }
    public string Intersection { get; set; }
    public string BlockNumber { get; set; }
    public string LandMark { get; set; }
    public string StreetName { get; set; }
    public string HighwayExit { get; set; }
    public City City { get; set; }
    public Beat Beat { get; set; }
    public bool School { get; set; }
    public SchoolName SchoolName { get; set; }
    public bool OutOfCounty { get; set; }
    public bool PiiFound { get; set; }
    public GeoLocation GeoLocation { get; set; }
}
