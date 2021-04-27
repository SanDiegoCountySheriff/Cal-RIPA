using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RIPA.Functions.Security
{
    public static class RIPAAuthorization
    {
        public static async Task<bool> ValidateUserRole(HttpRequest req, ILogger log)
        {
            var claims = await ValidateAccessToken(req, log);

            return claims.IsInRole("RIPA-USERS-ROLE");
        }

        public static async Task<bool> ValidateAdministratorRole(HttpRequest req, ILogger log)
        {
            var claims = await ValidateAccessToken(req, log);

            return claims.IsInRole("RIPA-ADMINS-ROLE");
        }


        private static async Task<ClaimsPrincipal> ValidateAccessToken(HttpRequest req, ILogger log)
        {
            var clientID = AuthorizationConfiguration.RIPAAppClientID;
            var authority = AuthorizationConfiguration.RIPAAutorityName;
            var validIssuers = AuthorizationConfiguration.RIPAValidIssuers;

            var accessToken = GetAccessToken(req);

#if DEBUG
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
#endif

            ConfigurationManager<OpenIdConnectConfiguration> configManager =
            new ConfigurationManager<OpenIdConnectConfiguration>(
            $"{authority}/.well-known/openid-configuration",
            new OpenIdConnectConfigurationRetriever());

            OpenIdConnectConfiguration config = null;
            config = await configManager.GetConfigurationAsync();

            ISecurityTokenValidator tokenValidator = new JwtSecurityTokenHandler();

            TokenValidationParameters validationParameters = new TokenValidationParameters
            {
                ValidAudiences = new[] { clientID },
                ValidIssuers = validIssuers,
                IssuerSigningKeys = config.SigningKeys
            };

            try
            {
                SecurityToken securityToken;

                var claimsPrincipal = tokenValidator.ValidateToken(accessToken, validationParameters, out securityToken);

                return claimsPrincipal;
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
            }

            return null;
        }

        private static string GetAccessToken(HttpRequest req)
        {
            var authorizationHeader = req.Headers?["Authorization"];

            string[] parts = authorizationHeader?.ToString().Split(null) ?? new string[0];

            if (parts.Length == 2 && parts[0].Equals("Bearer"))
            {
                return parts[1];
            }

            throw new UnauthorizedAccessException();
        }
    }
}
