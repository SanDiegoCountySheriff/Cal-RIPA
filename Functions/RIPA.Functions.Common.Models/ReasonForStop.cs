using System.Collections.Generic;

namespace RIPA.Functions.Common.Models;

public class ReasonForStop
{
    public string Key { get; set; }
    public string Reason { get; set; }
    public List<Detail> ListDetail { get; set; }
    public List<Codes> ListCodes { get; set; }
}
