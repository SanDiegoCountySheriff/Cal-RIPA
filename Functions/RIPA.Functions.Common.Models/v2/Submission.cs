using System;

namespace RIPA.Functions.Common.Models.v2;

public class Submission
{
    public Guid Id { get; set; }
    public DateTime DateSubmitted { get; set; }
    public string Status { get; set; }
    public string FileName { get; set; }
    public SubmissionError[] ListSubmissionError { get; set; }
}
