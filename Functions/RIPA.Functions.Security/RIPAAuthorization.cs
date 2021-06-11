using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
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

        public static async Task<bool> ValidateUserOrAdministratorRole(HttpRequest req, ILogger log)
        {
            var claims = await ValidateAccessToken(req, log);
            
            return claims.IsInRole("RIPA-ADMINS-ROLE") || claims.IsInRole("RIPA-USERS-ROLE");
        }

        public static async Task<string> GetUserId(HttpRequest req, ILogger log)
        {
            var claims = await ValidateAccessToken(req, log);
            return claims.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
        }


        private static async Task<ClaimsPrincipal> ValidateAccessToken(HttpRequest req, ILogger log)
        {
            try
            {
                var accessToken = ExtractTokenFromRequestHeaders(req);
                Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = false;
#if DEBUG
                Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
#endif

                ISecurityTokenValidator tokenValidator = new JwtSecurityTokenHandler();
                TokenValidationParameters validationParameters = await ConfigureTokenValidationParameters();

                var claimsPrincipal = tokenValidator.ValidateToken(accessToken, validationParameters, out SecurityToken securityToken);

                if (!claimsPrincipal.Identity.IsAuthenticated)
                {
                    throw new SecurityTokenExpiredException();
                }

                ValidateTokenLifetime(securityToken);
                ValidateTokenAudience(securityToken);

                return claimsPrincipal;
            }
            catch (Exception ex)
            {
                log.LogError(ex.ToString());
                throw;
            }
        }

        private static void ValidateTokenAudience(SecurityToken securityToken)
        {
            var audiences = ((System.IdentityModel.Tokens.Jwt.JwtSecurityToken)securityToken).Audiences;
            bool ripaAudience = audiences.Contains(AuthorizationConfiguration.RIPAAppClientID);

            if (!ripaAudience)
            {
                throw new SecurityTokenInvalidAudienceException();
            }
        }

        private static void ValidateTokenLifetime(SecurityToken securityToken)
        {
            double timeLeft = securityToken.ValidTo.ToLocalTime().Subtract(DateTime.Now).TotalMilliseconds;

            if (timeLeft <= 0)
            {
                throw new SecurityTokenExpiredException();
            }
        }

        private static async Task<TokenValidationParameters> ConfigureTokenValidationParameters()
        {
            var clientID = AuthorizationConfiguration.RIPAAppClientID;
            var authority = AuthorizationConfiguration.RIPAAutorityName;
            var validIssuers = AuthorizationConfiguration.RIPAValidIssuers;

            ConfigurationManager<OpenIdConnectConfiguration> configManager =
                new ConfigurationManager<OpenIdConnectConfiguration>(
                    $"{authority}/.well-known/openid-configuration",
                    new OpenIdConnectConfigurationRetriever());

            OpenIdConnectConfiguration config = await configManager.GetConfigurationAsync();

            TokenValidationParameters validationParameters = new TokenValidationParameters
            {
                ValidAudiences = new[] { clientID },
                ValidIssuers = validIssuers,
                IssuerSigningKeys = config.SigningKeys
            };

            return validationParameters;
        }

        public static string ExtractTokenFromRequestHeaders(HttpRequest req)
        {
            var authorizationHeader = req.Headers?["Authorization"];

            string[] parts = authorizationHeader?.ToString().Split(null) ?? new string[0];

            if (parts.Length == 2 && parts[0].Equals("Bearer"))
            {
                return parts[1];
            }

            throw new SecurityTokenValidationException();
        }
    }
}
