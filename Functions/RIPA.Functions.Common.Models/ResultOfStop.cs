using System.Collections.Generic;

namespace RIPA.Functions.Common.Models;

public class ResultOfStop
{
    public string Result { get; set; }
    public List<Codes> ListCodes { get; set; }
    public string Key { get; set; }
}
