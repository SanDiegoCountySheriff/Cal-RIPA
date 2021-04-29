using RIPA.Functions.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.REST
{
    public class StopService
    {
        private static string getStopUrl = Environment.GetEnvironmentVariable("GetStopUrl");
        private static string putStopUrl = Environment.GetEnvironmentVariable("PutStopUrl");
        private static HttpClient _httpClient;
        public StopService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Stop> GetStop(string id)
        {
            var response = await _httpClient.GetAsync(getStopUrl.Replace("{Id}", id));
            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Failed Get Stop for submission by stop id: {id}");
            }
            var jsonString = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            Stop stop = JsonSerializer.Deserialize<Stop>(jsonString, options);
            return stop;
        }

        public async void PutStop(Stop stop)
        {
            var httpContent = new StringContent(JsonSerializer.Serialize(stop), UnicodeEncoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(putStopUrl.Replace("{Id}", stop.id), httpContent);
            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Failed Put Stop Submission for stop id: {stop.id}");
            }
        }

        public Stop NewSubmission(Stop stop, DateTime dateSubmitted, Guid submissionId)
        {
            Common.Models.Submission submission = new Common.Models.Submission
            {
                DateSubmitted = dateSubmitted,
                Id = submissionId,
                Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Pending)
            };

            if (stop.DojSubmit == null)
            {
                stop.DojSubmit = new Common.Models.DojSubmit
                {
                    Submissions = new Common.Models.Submission[0]
                };
            }

            var submissions = stop.DojSubmit.Submissions.ToList();
            submissions.Add(submission);

            stop.DojSubmit.Submissions = submissions.ToArray();
            stop.DojSubmit.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Pending);
            return stop;
        }

        public Stop ErrorSubmission(Stop stop, string errorType, string error, string fileName)
        {
            var pendingSubmissions = stop.DojSubmit.Submissions.Where(x => x.Status == Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Pending));
            foreach (var submission in pendingSubmissions)
            {
                submission.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed);
                submission.Error = new SubmissionError
                {
                    DateReported = DateTime.UtcNow,
                    Error = error,
                    ErrorType = errorType,
                    FileName = fileName
                };
            }
            stop.DojSubmit.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed);
            return stop;
        }
    }
}
