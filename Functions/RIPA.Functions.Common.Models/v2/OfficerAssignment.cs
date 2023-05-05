using RIPA.Functions.Common.Models.Interfaces;

namespace RIPA.Functions.Common.Models.v2;

public class OfficerAssignment : IOfficerAssignment
{
    public string Key { get; set; }
    public string Type { get; set; }
    public string OtherType { get; set; }
}
