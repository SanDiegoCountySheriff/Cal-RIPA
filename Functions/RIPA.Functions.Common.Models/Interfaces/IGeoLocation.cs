using System;

namespace RIPA.Functions.Common.Models.Interfaces;

public interface IGeoLocation
{
    decimal? Latitude { get; set; }
    decimal? Longitude { get; set; }
}

