using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.v1;
using RIPA.Functions.Submission.Models;
using System;

namespace RIPA.Functions.Submission.Services.REST.Contracts;

public interface IStopService
{
    IStop NewSubmission(IStop stop, DateTime dateSubmitted, Guid submissionId, string fileName);
    IStop ErrorSubmission(IStop stop, SubmissionError SubmissionError, string stopStatus);
    DojStop CastToDojStop(IStop stop);
}
