using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;

public interface IStopCosmosDbService
{
    Task<IEnumerable<Models.Stop>> GetStopsAsync(string queryString);
    Task<Models.Stop> GetStopAsync(string id);
    Task<bool> CheckForDuplicateStop(string stopId, string ori, string officerId, string date, string time);
    Task AddStopAsync(Models.Stop stop);
    Task UpdateStopAsync(Models.Stop stop);
    Task DeleteStopAsync(string id);
    Task<IEnumerable<Models.StopStatusCount>> GetStopStatusCounts(string queryString);
    Task<IEnumerable<Models.SubmissionErrorSummary>> GetSubmissionErrorSummaries(string id);
    Task<IEnumerable<Models.SubmissionStopDateTimeSummary>> GetSubmissionStopDateTimeSummaries(string id);
    Task<IEnumerable<Models.DojError>> GetErrorCodes(string inputText, string submissionId);
}
