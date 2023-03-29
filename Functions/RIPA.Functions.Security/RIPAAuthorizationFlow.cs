using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Configurations;

namespace RIPA.Functions.Security
{
    public class RIPAAuthorizationFlow : OpenApiOAuthSecurityFlows
    {
        public RIPAAuthorizationFlow()
        {
            this.Implicit = new Microsoft.OpenApi.Models.OpenApiOAuthFlow()
            {
                AuthorizationUrl = new Uri($"https://login.microsoftonline.com/{AuthorizationConfiguration.RIPATenantId}/oauth2/v2.0/authorize"),
                 

            };
        }
    }
}
