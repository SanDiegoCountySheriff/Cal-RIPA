using RIPA.Functions.Common.Models.Interfaces;

namespace RIPA.Functions.Common.Models.v2;

public class GeoLocation : IGeoLocation
{
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}
