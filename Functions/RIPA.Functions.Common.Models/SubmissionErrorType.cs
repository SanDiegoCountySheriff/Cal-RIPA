using System.Runtime.Serialization;

namespace RIPA.Functions.Common.Models;

public enum SubmissionErrorType
{
    [EnumMember(Value = "FileLevelFatalError")]
    FileLevelFatalError,
    [EnumMember(Value = "RecordLevelFatalError")]
    RecordLevelFatalError,
    [EnumMember(Value = "RecordLevelError")]
    RecordLevelError,
    [EnumMember(Value = "SubmissionError")]
    SubmissionError
}
