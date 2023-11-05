using System.Runtime.Serialization;

namespace RIPA.Functions.Common.Models;

public enum SubmissionStatus
{
    [EnumMember(Value = "Unsubmitted")]
    Unsubmitted,
    [EnumMember(Value = "Submitted")]
    Submitted,
    [EnumMember(Value = "Resubmitted")]
    Resubmitted,
    [EnumMember(Value = "Failed")]
    Failed,
    [EnumMember(Value = "Pending")]
    Pending,
    [EnumMember(Value = "NFIA")]
    NFIA,
}
