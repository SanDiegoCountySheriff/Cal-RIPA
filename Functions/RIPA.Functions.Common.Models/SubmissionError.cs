using System;

namespace RIPA.Functions.Common.Models;

public class SubmissionError
{
    public string ErrorType { get; set; }
    public string Message { get; set; }
    public string Code { get; set; }
    public DateTime DateReported { get; set; }
    public string FileName { get; set; }
    public Guid SubmissionId { get; set; }
}
