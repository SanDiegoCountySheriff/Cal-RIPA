using System;
using RIPA.Functions.Common.Models.Interfaces;

namespace RIPA.Functions.Common.Models.v1;

public class SubmissionError : ISubmissionError
{
    public string ErrorType { get; set; }
    public string Message { get; set; }
    public string Code { get; set; }
    public DateTime DateReported { get; set; }
    public string FileName { get; set; }
    public Guid SubmissionId { get; set; }
}
