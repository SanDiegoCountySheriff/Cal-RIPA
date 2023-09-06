namespace RIPA.Functions.Common.Models;

public class ReasonGivenForStop
{
    public string Key { get; set; }
    public string Reason { get; set; }
    public Detail[] ListDetail { get; set; }
    public Codes[] ListCodes { get; set; }
}
