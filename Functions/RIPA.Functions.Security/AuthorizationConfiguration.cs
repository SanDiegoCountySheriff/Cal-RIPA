using System;
using System.Collections.Generic;
using System.Globalization;

namespace RIPA.Functions.Security
{
    public static class AuthorizationConfiguration
    {
        internal static readonly string RIPAAppClientID = Environment.GetEnvironmentVariable("ripa_app_id");
        internal static readonly string RIPATenantId = Environment.GetEnvironmentVariable("ripa_tenant_id");
        internal static readonly string RIPATenantName = Environment.GetEnvironmentVariable("ripa_tenant_name");

        internal static readonly string RIPALoginUrl = "https://login.microsoftonline.com/{0}/v2.0";
        internal static readonly string RIPAAutorityName = string.Format(CultureInfo.InvariantCulture, RIPALoginUrl, RIPATenantName);
        internal static readonly List<string> RIPAValidIssuers = new List<string>()
            {
                $"https://login.microsoftonline.com/{RIPATenantName}/",
                $"https://login.microsoftonline.com/{RIPATenantId}/",
                $"https://login.microsoftonline.com/{RIPATenantName}/v2.0",
                $"https://login.microsoftonline.com/{RIPATenantName}/oauth2/v2.0",
                $"https://login.microsoftonline.com/{RIPATenantId}/v2.0",
                $"https://login.microsoftonline.com/{RIPATenantId}/oauth2/v2.0",
                $"https://login.windows.net/{RIPATenantName}/",
                $"https://login.windows.net/{RIPATenantId}/",
                $"https://login.microsoft.com/{RIPATenantName}/",
                $"https://login.microsoft.com/{RIPATenantId}/",
                $"https://sts.windows.net/{RIPATenantId}/"
            };
    }
}