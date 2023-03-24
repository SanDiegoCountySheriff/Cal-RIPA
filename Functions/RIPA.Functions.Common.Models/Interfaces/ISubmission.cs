namespace RIPA.Functions.Common.Models.Interfaces;

public interface ISubmission
{
    ISubmissionError[] ListSubmissionError { get; set; }
    string FileName { get; set; }
    string Status { get; set; }
}

