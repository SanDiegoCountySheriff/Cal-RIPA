using RIPA.Functions.Common.Models;
using RIPA.Functions.Submission.Models;
using System;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.REST.Contracts
{
    public interface IStopService
    {
        Stop NewSubmission(Stop stop, DateTime dateSubmitted, Guid submissionId, string fileName);
        Stop ErrorSubmission(Stop stop, string errorType, string error, string fileName);
        DojStop CastToDojStop(Stop stop);

    }
}
