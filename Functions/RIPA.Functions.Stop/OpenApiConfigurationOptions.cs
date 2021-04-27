using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Configurations;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;

namespace RIPA.Functions.Stop
{
    public class OpenApiConfigurationOptions : IOpenApiConfigurationOptions
    {
        public OpenApiInfo Info { get; set; } = new OpenApiInfo()
        {
            Version = "1.0.0",
            Title = "Stop",
            Description = "Put, Get, and Delete Stops!",
            TermsOfService = new Uri("https://www.calsheriffs.org/"),
            Contact = new OpenApiContact()
            {
                Name = "CSSA",
                Email = "support@cssa.gov",
                Url = new Uri("https://www.calsheriffs.org/"),
            },
            License = new OpenApiLicense()
            {
                Name = "MIT",
                Url = new Uri("http://opensource.org/licenses/MIT"),
            }
        };

        public List<OpenApiServer> Servers { get; set; } = new List<OpenApiServer>();
    }
}