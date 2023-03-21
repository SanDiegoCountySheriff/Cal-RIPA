using RIPA.Functions.Common.Models.v1;

namespace RIPA.Functions.Common.Models.Interfaces
{
    public interface ILocation
    {
        Beat Beat { get; set; }
        string BlockNumber { get; set; }
        City City { get; set; }
        GeoLocation GeoLocation { get; set; }
        string HighwayExit { get; set; }
        string Intersection { get; set; }
        string LandMark { get; set; }
        bool OutOfCounty { get; set; }
        bool PiiFound { get; set; }
        bool School { get; set; }
        SchoolName SchoolName { get; set; }
        string StreetName { get; set; }
        bool ToggleLocationOptions { get; set; }
    }
}