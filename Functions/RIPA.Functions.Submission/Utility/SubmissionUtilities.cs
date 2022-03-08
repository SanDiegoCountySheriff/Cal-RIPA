using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Services.Stop.CosmosDb.Contracts;
using RIPA.Functions.Submission.Models;
using RIPA.Functions.Submission.Services.CosmosDb.Contracts;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Utility
{
    public class SubmissionUtilities
    {
        private readonly IStopCosmosDbService _stopCosmosDbService;
        private readonly ISubmissionCosmosDbService _submissionCosmosDbService;
        private readonly ISftpService _sftpService;
        private readonly string _sftpInputPath;
        private readonly ILogger _logger;
        private readonly string _storageConnectionString;
        private readonly string _storageContainerNamePrefix;
        private readonly BlobContainerClient _blobContainerClient;
        public SubmissionUtilities(IStopCosmosDbService stopCosmosDbService, ISubmissionCosmosDbService submissionCosmosDbService,  ISftpService sftpService, ILogger logger)
        {
            _stopCosmosDbService = stopCosmosDbService;
            _submissionCosmosDbService = submissionCosmosDbService;
            _sftpService = sftpService;
            _sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");
            _logger = logger;
            _storageConnectionString = Environment.GetEnvironmentVariable("RipaStorage");
            _storageContainerNamePrefix = Environment.GetEnvironmentVariable("ContainerPrefixSubmissions");
            _blobContainerClient = GetBlobContainerClient();
        }

        public bool IsValidSFTPConnection()
        {
            try
            {
                var files = _sftpService.ListAllFiles(_sftpInputPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed SFTP Connection Validation");
                return false;
            }
            return true;
        }

        public List<string> ValidateStops(IEnumerable<Stop> stops)
        {
            List<string> errorList = new List<string>();

            if (stops.Count() == 0)
            {
                errorList.Add("No stops found with given filters.");
                return errorList;
            }

            var currentPST = DateTime.UtcNow;

            try
            {
                currentPST = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(currentPST, "America/Los_Angeles"); //use for Linux
            }
            catch
            {
                currentPST = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(currentPST, "Pacific Standard Time"); //use for Windows
            }

            var CutoffDate = new DateTime(currentPST.Year - 1, 1, 1); //beginning of last year
            if (currentPST > new DateTime(currentPST.Year, 3, 31, 23, 59, 59)) // 03/31 11:59:59 PM
            {
                CutoffDate = new DateTime(currentPST.Year, 1, 1); //beginning this year
            }

            if (stops.Where(x => x.StopDateTime < CutoffDate).Any())
            {
                errorList.Add("Stop request contains stops from previous submission year.");
            }

            if (stops.Where(x => x.Status == SubmissionStatus.Failed.ToString() && x.IsEdited == false).Any())
            {
                errorList.Add("Stop request contains stops that are in Error state and require edit to submit.");
            }

            if (stops.Where(x => x.Status == SubmissionStatus.Submitted.ToString() && x.IsEdited == false).Any())
            {
                errorList.Add("Stop request contains stops that are in Submitted state and require edit to submit.");
            }

            if (stops.Where(x => x.Status == SubmissionStatus.Pending.ToString()).Any())
            {
                errorList.Add("Stop request contains stops that are in Pending state, please wait until submission is fully processed.");
            }

            if (stops.Where(x => x.IsPiiFound && !x.OverridePii).Any()) 
            { 
                errorList.Add("Stop request contains stops that contain PII and require edit or override PII to submit.");
            }
            return errorList;
        }

        public async Task<Guid> NewSubmission(IEnumerable<Stop> stops, UserProfile userProfile)
        {
            InitializeBlobContainer();
            Guid submissionId = Guid.NewGuid();
            Models.Submission submission = new Models.Submission
            {
                DateSubmitted = DateTime.UtcNow,
                Id = submissionId,
                RecordCount = stops.Count(),
                OfficerId = userProfile.OfficerId,
                OfficerName = userProfile.Name,
                MinStopDate = DateTime.Parse(stops.OrderBy(x => x.Date).First().Date),
                MaxStopDate = DateTime.Parse(stops.OrderByDescending(x => x.Date).First().Date),
            };
            await _submissionCosmosDbService.AddSubmissionAsync(submission);
            return submissionId;
        }

        public BlobContainerClient GetBlobContainerClient()
        {
            BlobServiceClient blobServiceClient = new BlobServiceClient(_storageConnectionString);
            string containerName = $"{_storageContainerNamePrefix}";
            BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
            return blobContainerClient;
        }

        public async void InitializeBlobContainer()
        {
            await _blobContainerClient.CreateIfNotExistsAsync();
        }

    }
}
