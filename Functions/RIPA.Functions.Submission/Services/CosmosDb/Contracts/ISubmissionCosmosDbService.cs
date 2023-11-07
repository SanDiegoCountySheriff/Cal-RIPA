using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.CosmosDb.Contracts;

public interface ISubmissionCosmosDbService
{
    Task<IEnumerable<Models.Submission>> GetSubmissionsAsync(string queryString);
    Task<Models.Submission> GetSubmissionAsync(string id);
    Task AddSubmissionAsync(Models.Submission submission);
    Task UpdateSubmissionAsync(string id, Models.Submission submission);
    Task DeleteSubmissionAsync(string id);
    Task<int> GetSubmissionsCountAsync(string queryString);
}
