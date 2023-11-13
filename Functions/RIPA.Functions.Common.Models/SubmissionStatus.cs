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
    [EnumMember(Value = "Unsubmitted_NFIA")]
    Unsubmitted_NFIA,
    [EnumMember(Value = "Submitted_NFIA")]
    Submitted_NFIA,
    [EnumMember(Value = "Pending_NFIA")]
    Pending_NFIA,
    [EnumMember(Value = "Failed_NFIA")]
    Failed_NFIA,
}
