using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Submission.Services.REST;
using RIPA.Functions.Submission.Services.SFTP;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;


namespace RIPA.Functions.Submission.Functions
{
    public static class PostSubmit
    {
        private static HttpClient httpClient = new HttpClient();
        private static string sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");


        [FunctionName("PostSubmit")]
        [OpenApiOperation(operationId: "PostSubmit", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "DOJ Submit Success")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] SubmitRequest submitRequest, ILogger log)
        {
            log.LogInformation("Submit to DOJ requested");

            var config = new SftpConfig
            {
                Host = Environment.GetEnvironmentVariable("SftpHost"),
                Port = Convert.ToInt32(Environment.GetEnvironmentVariable("SftpPort")),
                UserName = Environment.GetEnvironmentVariable("SftpUserName"),
                Password = Environment.GetEnvironmentVariable("SftpPassword")
            };
            SftpService sftpService = new SftpService(log, config);
            StopService stopService = new StopService(httpClient);

            //Grouping statistics based on user input 
            //high level report of Submission
            //its a lot of information

            //TODO Create a submission cosmosDB record
            //TODO Create directory in Azure Storage ++ Directory Naming Convention
            Guid submissionId = Guid.NewGuid();
            foreach (var stopId in submitRequest.StopIds)
            {
                var stop = await stopService.GetStop(stopId); //BATCH or queue
                //TODO create json file in Azure Storage directory created in above TODO
                //TODO FORMAT STOP FOR DOJ
                DateTime dateSubmitted = DateTime.UtcNow;
                sftpService.UploadStop(stop, $"{sftpInputPath}{dateSubmitted.ToString("yyyyMMddHHmmss")}_{stop.Ori}_{stop.id}.json");
                stopService.PutStop(stopService.NewSubmission(stop, dateSubmitted, submissionId));
                Console.WriteLine(stop);
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

