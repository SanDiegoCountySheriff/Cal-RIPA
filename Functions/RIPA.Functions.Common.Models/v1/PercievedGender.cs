using System.Runtime.Serialization;

namespace RIPA.Functions.Common.Models.v1;

public enum PercievedGender
{
    [EnumMember(Value = "Male")]
    Male = 1,
    [EnumMember(Value = "Female")]
    Female = 2,
    [EnumMember(Value = "Transgender man/boy")]
    TransgenderManBoy = 3,
    [EnumMember(Value = "Transgender woman/girl")]
    TransgenderWomanGirl = 4
}
