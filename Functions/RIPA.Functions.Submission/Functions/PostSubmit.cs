using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Submission.Services.REST;
using RIPA.Functions.Submission.Services.REST.Contracts;
using RIPA.Functions.Submission.Services.SFTP;
using RIPA.Functions.Submission.Services.SFTP.Contracts;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;


namespace RIPA.Functions.Submission.Functions
{
    public class PostSubmit
    {
        private readonly ISftpService _sftpService;
        private readonly IStopService _stopService;
        private readonly string _sftpInputPath;

        public PostSubmit(ISftpService sftpService, IStopService stopService)
        {
            _sftpService = sftpService;
            _stopService = stopService;
            _sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");
        }

        [FunctionName("PostSubmit")]
        [OpenApiOperation(operationId: "PostSubmit", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "DOJ Submit Success")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] SubmitRequest submitRequest, ILogger log)
        {
            log.LogInformation("Submit to DOJ requested");

            //Grouping statistics based on user input (I think this means the query used for submission of stops)
            //high level report of Submission
            //Count of records submitted and...
            //Date of submission requested
            //unique id of submission which could allow for grouping of stops by submissionId using the GetStops endpoint

            Guid submissionId = Guid.NewGuid();
            foreach (var stopId in submitRequest.StopIds)
            {
                var stop = await _stopService.GetStopAsync(stopId);
                DateTime dateSubmitted = DateTime.UtcNow;
                string fileName = $"{dateSubmitted.ToString("yyyyMMddHHmmss")}_{stop.Ori}_{stop.id}.json";
                _sftpService.UploadStop(_stopService.CastToDojStop(stop), $"{_sftpInputPath}{fileName}");
                await _stopService.PutStopAsync(_stopService.NewSubmission(stop, dateSubmitted, submissionId, fileName));
            }

            //TODO improve response 
            return new OkObjectResult(submitRequest);
        }

        public class SubmitRequest
        {
            public List<string> StopIds { get; set; }
        }







    }
}

