using RIPA.Functions.Submission.Services.ShareClientService.Contracts;
using Azure.Storage.Files.Shares;

namespace RIPA.Functions.Submission.Services.ShareClientService
{
    public class CpraShareClientService : ICpraShareClientService
    {
        private readonly ShareClient _shareClient;

        public CpraShareClientService(ShareClient shareClient)
        {
            _shareClient = shareClient;
        }
    }
}
