using System;
using RIPA.Functions.Common.Models.Interfaces;

namespace RIPA.Functions.Common.Models.v1;

public class Submission : ISubmission
{
    public Guid Id { get; set; }
    public DateTime DateSubmitted { get; set; }
    public string Status { get; set; }
    public string FileName { get; set; }
    public ISubmissionError[] ListSubmissionError { get; set; }
}
