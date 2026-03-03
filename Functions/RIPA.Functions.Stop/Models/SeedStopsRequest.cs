namespace RIPA.Functions.Stop.Models;

public class SeedStopsRequest
{
    public int Count { get; set; }
    public string StatuteCode { get; set; }
    public string StatuteText { get; set; }
    public string CityCode { get; set; }
    public string CityText { get; set; }
}
