using System.Runtime.Serialization;

namespace RIPA.Functions.Common.Models.v2;

public enum PercievedGender
{
    [EnumMember(Value = "Cisgender Man/Boy")]
    CisgenderManBoy = 1,
    [EnumMember(Value = "Cisgender Woman/Girl")]
    CisgenderWomanGirl = 2,
    [EnumMember(Value = "Transgender Man/Boy")]
    TransgenderManBoy = 3,
    [EnumMember(Value = "Transgender Woman/Girl")]
    TransgenderWomanGirl = 4
}
