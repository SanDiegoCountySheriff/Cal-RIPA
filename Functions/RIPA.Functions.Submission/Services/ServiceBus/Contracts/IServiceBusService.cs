using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.ServiceBus.Contracts
{
    public interface IServiceBusService
    {
        public Task SendServiceBusMessagesAsync(List<string> listStopId, Guid submissionId );
    }
}
