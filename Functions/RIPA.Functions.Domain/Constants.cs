using System.Globalization;
using System.Collections.Generic;

namespace RIPA.Functions.Domain.Functions.Beats
{
    // demo code, usually want to pull these from key vault or config etc.
    internal static class AuthenticationConstants
    {
        internal static string clientID = "732ac8b5-a320-4762-9262-41de2cbb72c4"; // this is the client id, also known as AppID. This is not the ObjectID
        internal static string tenant = "lesliemcwhirtergmail.onmicrosoft.com"; // this is your tenant name
        internal static string tenantid = "6ab62649-cbe9-460c-b26f-ff063ee0d392"; // this is your tenant id (GUID)

        internal static string aadInstance = "https://login.microsoftonline.com/{0}/v2.0";
        internal static string authority = string.Format(CultureInfo.InvariantCulture, aadInstance, tenant);
        internal static List<string> validIssuers = new List<string>()
            {
                $"https://login.microsoftonline.com/{tenant}/",
                $"https://login.microsoftonline.com/{tenantid}/",
                $"https://login.microsoftonline.com/{tenant}/v2.0",
                $"https://login.microsoftonline.com/{tenantid}/v2.0",
                $"https://login.windows.net/{tenant}/",
                $"https://login.windows.net/{tenantid}/",
                $"https://login.microsoft.com/{tenant}/",
                $"https://login.microsoft.com/{tenantid}/",
                $"https://sts.windows.net/{tenantid}/"
            };
    }
}