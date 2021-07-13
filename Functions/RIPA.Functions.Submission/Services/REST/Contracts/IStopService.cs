using RIPA.Functions.Common.Models;
using RIPA.Functions.Submission.Models;
using System;

namespace RIPA.Functions.Submission.Services.REST.Contracts
{
    public interface IStopService
    {
        Stop NewSubmission(Stop stop, DateTime dateSubmitted, Guid submissionId, string fileName);
        Stop ErrorSubmission(Stop stop, SubmissionError SubmissionError, string stopStatus);
        DojStop CastToDojStop(Stop stop);

    }
}
