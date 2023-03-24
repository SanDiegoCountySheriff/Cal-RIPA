namespace RIPA.Functions.Common.Models;

public class ReasonForStop
{
    public string Key { get; set; }
    public string Reason { get; set; }
    public Detail[] ListDetail { get; set; }
    public Codes[] ListCodes { get; set; }
}
