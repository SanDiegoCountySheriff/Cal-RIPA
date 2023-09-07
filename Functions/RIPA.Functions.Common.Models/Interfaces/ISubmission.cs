using System;

namespace RIPA.Functions.Common.Models.Interfaces;

public interface ISubmission
{
    DateTime DateSubmitted { get; set; }
    string FileName { get; set; }
    Guid Id { get; set; }
    ISubmissionError[] ListSubmissionError { get; set; }
    string Status { get; set; }
}