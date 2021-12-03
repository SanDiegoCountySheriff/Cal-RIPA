using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Configurations;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;

namespace RIPA.Functions.Submission
{
    public class OpenApiConfigurationOptions : DefaultOpenApiConfigurationOptions
    {
        public override OpenApiInfo Info { get; set; } = new OpenApiInfo()
        {
            Version = "1.0.0",
            Title = "Submission",
            Description = "Submit your stops!",
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

        public override List<OpenApiServer> Servers { get; set; } = new List<OpenApiServer>();
    }
}
