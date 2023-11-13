using RIPA.Functions.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;

public interface IStopCosmosDbService<T>
{
    Task<IEnumerable<T>> GetStopsAsync(string queryString);
    Task<T> GetStopAsync(string id);
    Task<bool> CheckForDuplicateStop(string stopId, string ori, string officerId, string date, string time);
    Task AddStopAsync(T stop);
    Task UpdateStopAsync(T stop);
    Task DeleteStopAsync(string id);
    Task<IEnumerable<StopStatusCount>> GetStopStatusCounts(string queryString);
    Task<IEnumerable<SubmissionErrorSummary>> GetSubmissionErrorSummaries(string id, int version);
    Task<IEnumerable<SubmissionStopDateTimeSummary>> GetSubmissionStopDateTimeSummaries(string id);
    Task<IEnumerable<DojError>> GetErrorCodes(string inputText, string submissionId);
}
