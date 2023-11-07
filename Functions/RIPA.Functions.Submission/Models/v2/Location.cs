namespace RIPA.Functions.Submission.Models.v2;

public class Location
{
    public string LocationType { get; set; }
    public string Latitude { get; set; }
    public string Longitude { get; set; }
    public string BlockNumber { get; set; }
    public string StreetName { get; set; }
    public string CrossStreet1 { get; set; }
    public string CrossStreet2 { get; set; }
    public string Highway { get; set; }
    public string ClosestExit { get; set; }
    public string OtherLocation { get; set; }
    public string City { get; set; }
    public string K12_Flag { get; set; }
    public string K12Code { get; set; }
}
