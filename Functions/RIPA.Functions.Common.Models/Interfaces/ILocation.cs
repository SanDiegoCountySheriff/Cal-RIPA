using RIPA.Functions.Common.Models.v1;

namespace RIPA.Functions.Common.Models.Interfaces
{
    public interface ILocation
    {
        IBeat Beat { get; set; }
        string BlockNumber { get; set; }
        ICity City { get; set; }
        IGeoLocation GeoLocation { get; set; }
        string HighwayExit { get; set; }
        string Intersection { get; set; }
        string LandMark { get; set; }
        bool OutOfCounty { get; set; }
        bool PiiFound { get; set; }
        bool School { get; set; }
        ISchoolName SchoolName { get; set; }
        string StreetName { get; set; }
        bool ToggleLocationOptions { get; set; }
    }
}