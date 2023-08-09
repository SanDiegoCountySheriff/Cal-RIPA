using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Submission.Models.v1;
using System;

namespace RIPA.Functions.Submission.Services.REST.Contracts;

public interface IStopService<T>
{
    T NewSubmission(T stop, DateTime dateSubmitted, Guid submissionId, string fileName);
    T ErrorSubmission(T stop, SubmissionError SubmissionError, string stopStatus);
    DojStop CastToDojStop(T stop);
}
