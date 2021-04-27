using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using RIPA.Functions.Submission.Models;
using RIPA.Functions.Submission.Services.SFTP;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;


namespace RIPA.Functions.Submission.Functions
{
    public static class PostSubmit
    {
        private static HttpClient httpClient = new HttpClient();
        private static string getStopUrl = Environment.GetEnvironmentVariable("GetStopUrl");
        private static string putStopUrl = Environment.GetEnvironmentVariable("PutStopUrl");
        private static string sftpInputPath = Environment.GetEnvironmentVariable("SftpInputPath");

        [FunctionName("PostSubmit")]
        [OpenApiOperation(operationId: "PostSubmit", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(string), Description = "DOJ Submit Success")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] SubmitRequest submitRequest, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var config = new SftpConfig
            {
                Host = Environment.GetEnvironmentVariable("SftpHost"),
                Port = Convert.ToInt32(Environment.GetEnvironmentVariable("SftpPort")),
                UserName = Environment.GetEnvironmentVariable("SftpUserName"),
                Password = Environment.GetEnvironmentVariable("SftpPassword")
            };
            SftpService sftpService = new SftpService(log, config);
            //sftpService.ListAllFiles(Environment.GetEnvironmentVariable("SftpOutput"));

            //string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            //SubmitRequest submitRequest = JsonConvert.DeserializeObject<SubmitRequest>(requestBody);

            foreach (var stopId in submitRequest.StopIds)
            {
                //Create json file in AZURE storage AND Upload SFTP JSON, (update)/ PUT the Stop with update DOJ submission object and intitial status of pending...
                var stop = await GetStop(stopId);
                sftpService.UploadStop(stop ,$"{sftpInputPath}{stop.id}.json");
                Console.WriteLine(stop);
            }



            string responseMessage = "DOJ record submit completed successfully";

            return new OkObjectResult(responseMessage);
        }

        public class SubmitRequest
        {
            public List<string> StopIds { get; set; }
        }


        public static async Task<Stop> GetStop(string Id)
        {
            var stopResponse = await httpClient.GetAsync(getStopUrl.Replace("{Id}",Id));
            var jsonString = await stopResponse.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Stop>(jsonString); 
        }

    }
}

