using Azure;
using Azure.AI.TextAnalytics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading.Tasks;

namespace RIPA.Functions.TextAnalytics.Functions
{
    public static class PostCheckStringForPII
    {
        private static readonly AzureKeyCredential credentials = new AzureKeyCredential(Environment.GetEnvironmentVariable("TextAnalyticsKey"));
        private static readonly Uri endpoint = new Uri(Environment.GetEnvironmentVariable("TextAnalyticsEndpoint"));

        [FunctionName("PostCheckStringForPII")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "Post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string document = data?.Document;

            var client = new TextAnalyticsClient(endpoint, credentials);
            var response = client.RecognizePiiEntities(document);

            string responseMessage = "BETA PII Entities:";
            foreach (var entity in response.Value)
            {
                responseMessage += Environment.NewLine + $"\tText: {entity.Text},\tCategory: {entity.Category},\tSub-Category: {entity.SubCategory}";
                responseMessage += Environment.NewLine + $"\t\tScore: {entity.ConfidenceScore:F2}";
                
            }
            responseMessage += Environment.NewLine + $"\t\t\tRedacted Text: {response.Value.RedactedText}";
            responseMessage += Environment.NewLine + $"\t\t\tWarnings: {response.Value.Warnings.Count}";


            responseMessage += Environment.NewLine;
            var response2 = client.RecognizeEntities(document);
            responseMessage += "Named Entities:";
            foreach (var entity in response2.Value)
            {
                responseMessage += Environment.NewLine + $"\tText: {entity.Text},\tCategory: {entity.Category},\tSub-Category: {entity.SubCategory}";
                responseMessage += Environment.NewLine + $"\t\tScore: {entity.ConfidenceScore:F2}";
            }
            responseMessage += Environment.NewLine + $"\t\t\tWarnings: {response2.Value.Warnings.Count}";

            return new OkObjectResult(responseMessage);
        }

        //static void RecognizePIIExample(TextAnalyticsClient client)
        //{
        //    string document = "A developer with SSN 859-98-0987 whose phone number is 800-102-1100 is building tools with our APIs.";

        //    PiiEntityCollection entities = client.RecognizePiiEntities(document).Value;

        //    Console.WriteLine($"Redacted Text: {entities.RedactedText}");
        //    if (entities.Count > 0)
        //    {
        //        Console.WriteLine($"Recognized {entities.Count} PII entit{(entities.Count > 1 ? "ies" : "y")}:");
        //        foreach (PiiEntity entity in entities)
        //        {
        //            Console.WriteLine($"Text: {entity.Text}, Category: {entity.Category}, SubCategory: {entity.SubCategory}, Confidence score: {entity.ConfidenceScore}");
        //        }
        //    }
        //    else
        //    {
        //        Console.WriteLine("No entities were found.");
        //    }
        //}
    }


}

