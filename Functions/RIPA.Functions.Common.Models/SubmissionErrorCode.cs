using System.Runtime.Serialization;

namespace RIPA.Functions.Common.Models;

public enum SubmissionErrorCode
{
    [EnumMember(Value = "FTS")] // Failed to submit
    FTS,
    [EnumMember(Value = "RLFE")]
    RLFE,
    [EnumMember(Value = "FLFE")]
    FLFE
}
