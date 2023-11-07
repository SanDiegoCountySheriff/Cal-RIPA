using System.Runtime.Serialization;

namespace RIPA.Functions.Common.Models;

public enum StopVersion
{
    [EnumMember(Value = "1")]
    V1 = 1,
    [EnumMember(Value = "2")]
    V2 = 2
}