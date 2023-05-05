using System;

namespace RIPA.Functions.Common.Models.Interfaces;

public interface ISubmissionError
{
    string Code { get; set; }
    DateTime DateReported { get; set; }
    string ErrorType { get; set; }
    string FileName { get; set; }
    string Message { get; set; }
    Guid SubmissionId { get; set; }
}