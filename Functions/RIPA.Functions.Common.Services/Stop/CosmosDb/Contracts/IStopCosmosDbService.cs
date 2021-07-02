using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts
{
    public interface IStopCosmosDbService
    {
        Task<IEnumerable<Common.Models.Stop>> GetStopsAsync(string queryString);
        Task<Common.Models.Stop> GetStopAsync(string id);
        Task<bool> CheckForDuplicateStop(string stopId, string ori, string officerId, string date, string time);
        Task AddStopAsync(Common.Models.Stop stop);
        Task UpdateStopAsync(string id, Common.Models.Stop stop);
        Task DeleteStopAsync(string id);
        Task<IEnumerable<Common.Models.StopStatusCount>> GetStopStatusCounts(string queryString);
        Task<IEnumerable<Common.Models.SubmissionErrorSummary>> GetSubmissionErrorSummaries(string id);
        Task<IEnumerable<Common.Models.SubmissionStopDateTimeSummary>> GetSubmissionStopDateTimeSummaries(string id);
        Task<IEnumerable<Common.Models.DojError>> GetErrorCodes(string inputText);
    }
}
