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
    public ICity City { get; set; }
    public IBeat Beat { get; set; }
    public bool School { get; set; }
    public ISchoolName SchoolName { get; set; }
    public bool OutOfCounty { get; set; }
    public bool PiiFound { get; set; }
    public IGeoLocation GeoLocation { get; set; }
}
