using RIPA.Functions.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;

public interface IV1StopCosmosDbService
{
    Task<IEnumerable<Models.v1.Stop>> GetStopsAsync(string queryString);
    Task<Models.v1.Stop> GetStopAsync(string id);
    Task<bool> CheckForDuplicateStop(string stopId, string ori, string officerId, string date, string time);
    Task AddStopAsync(Models.v1.Stop stop);
    Task UpdateStopAsync(Models.v1.Stop stop);
    Task DeleteStopAsync(string id);
    Task<IEnumerable<StopStatusCount>> GetStopStatusCounts(string queryString);
    Task<IEnumerable<SubmissionErrorSummary>> GetSubmissionErrorSummaries(string id);
    Task<IEnumerable<SubmissionStopDateTimeSummary>> GetSubmissionStopDateTimeSummaries(string id);
    Task<IEnumerable<DojError>> GetErrorCodes(string inputText, string submissionId);
}
