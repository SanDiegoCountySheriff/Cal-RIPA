using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.v1;
using RIPA.Functions.Submission.Models.v1;
using System;

namespace RIPA.Functions.Submission.Services.REST.v1.Contracts;

public interface IStopService
{
    Stop NewSubmission(Stop stop, DateTime dateSubmitted, Guid submissionId, string fileName);
    Stop ErrorSubmission(Stop stop, SubmissionError SubmissionError, string stopStatus);
    DojStop CastToDojStop(Stop stop);
}
