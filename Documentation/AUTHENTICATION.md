# Cal-RIPA

## Authentication & Authorization

CSSA RIPA uses Azure Active Directory (AAD) OAuth w/OpenID Connect (OIDC) & Role Based Access Control (RBAC) for authentication and authorization. Each deployment of CSSA RIPA requires an authentication configuration in order to ensure users abillities & access. Click [here](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/auth-oidc) to learn more about OAuth & OIDC in Azure.

Azure provides OAuth functionality using two core concepts. These concepts are "App Registration" and "Enterprise Applications" where the former is a template that describes the details of authentication/autorization and the ladder is a direct implementation (instance) of the template in the form of a Service Principal. Click [here](https://docs.microsoft.com/en-us/azure/active-directory/saas-apps/openidoauth-tutorial#:~:text=%20Configure%20an%20OpenID%2FOAuth%20application%20from%20the%20Azure,use%20the%20Azure%20AD%20consent%20framework...%20More%20) to learn more about configuring OAuth w/OpenID Connect.

CSSA RIPA implements two user roles to manage user autorization; the "RIPA-USERS-ROLE" and the "RIPA-ADMINS-ROLE". Once these two roles have been defined in an App Registration, they can then be assigned to AAD Groups and users can be added or removed from those groups as agency policy dictates.

Azure implements it's OAuth/OIDC the same whether your using Azure Cloud (public) or Azure US Government Cloud. Therefor, you may use the Cloud of your choice for Authentication & Authorization. However, CSSA RIPA must be deployed to Azure US Government Cloud.

## Creating your Authentication & Authorization Scheme

### Scripted (easiest)

In the [Authentication](/Deployment/Scripts/Authentication) directory of this repository you will find several scripts that can be used to create everything you need for authentication & authorization.

Use the following instructions to create the required resources.

    1. Make sure you have the following tools installed
       1. PowerShell (at least version 5.1 or greater)
          https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-7.1
       2. Azure Cli (at least version 2.10 or greater)
          https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
    2. Clone or download the files from this repository
       1. git clone git@github.com:SanDiegoCountySheriff/Cal-RIPA.git
    3. Navigate to the "Deployment/Scripts/Authentication" folder of the repository
    4. Open Powershell (running it as an **Administrator**)
    5. Connect to you Azure Subscription
       1. az cloud set -n AzureUSGovernment
       2. az login --tenant 00000000-0000-0000-0000-00000000000
    6. Run the script New-RIPAAuthenticationScheme.ps1 with the following parameters
       1. -DisplayName - This is the name that will be applied to the App Registration and Enterprise Application (Service Principal)
       2. -ReplyUri - This will be the URL of your deployed instance of CSSA RIPA. Make sure you use the right value here or you will be required to manually set the value later on
       3. -UserGroupName - This will be the name given to the "Users" AAD Group. The script will create the group if it does not exist
       4. -AdminGroupName - This will be the name given to the "Administrators" AAD Group. The script will create the group if it does not exist

        Example: ./New-RIPAAuthenticationScheme.ps1 -DisplayName "MY-RIPA-AUTHENTICATION" -ReplyUri "https://example-ripa.cssa.cloud" -UserGroupName "RIPA-USERS" -AdminGroupName "RIPA-ADMINS"

    7. Be sure to capture the output from the script as it will have vital details required when installing the CSSA RIPA application

### Manual (hardest)

The following guide will walk you through each step required to create a CSSA RIPA enabled authentication & authorization scheme in your AAD tenant. You must be sure to follow each step as all of these settings are required.

    1. Open your browser to the Azure portal (you can use Azure public or Azure US Government)
    2. Search for and select "Azure Active Directory" using the search box on the top of the page
    3. Select the "App Registration" blade on the left side of the screen
    4. Select the "New Registration" button
    5. Enter the name you wish to use for this App Registration (something like "RIPA-AUTH-PROD")
    6. Select the "Accounts in this organizational directory only ({your tenant name} only - Single tenant)" option
    7. Do NOT enter a Redirect URI at this time
    8. Select the "Register" button (this will take you to the details page of your new App Registration)
    9. Select the "Authentication" blade from the left side of the screen
    10. Select the "Add Platform" button and add the URL of the CSSA RIPA deployment as an Single Page Application (SPA)
        1.  This needs to be anticipated and coordinated during the CSSA RIPA deployment, but can be updated later
    11. Make sure that the "Allow public client flows" setting is set to "No"
    12. Select the "Save" button
    13. Select the "Expose an API" blade from the left side of the screen
    14. Select the "Set" button that is to the right of the "Application ID URI" label
    15. Do NOT change anything and select the "Save" button
    16. Select the "Add a scope" button in the next section
    17. Use the following values exactly
        1. Scope name == user_impersonation
        2. Who can consent == Admins Only
        3. Admin consent display name == user_impersonation
        4. Admin consent description == Allows users to be impersonated by the application
        5. User consent display name == user_impersonation
        6. User consent description == Allows users to be impersonated by the application
        7. State == Enabled
    18. Select the "Add scope" button
    19. Select the "Manifest" blade from the left side of the screen
    20. In the Json, find the row that looks like this: "appRoles": [],
    21. Find the repository file /Deployment/Scripts/Authentication/RIPA-RolesManifest.json and copy the contents exactly as they are
    22. Replace the brackets "[]" of the "appRoles" property with the contents you just copied
            "appRoles": [
                {
                    "allowedMemberTypes": [
                        "User"
                    ],
                    "description": "RIPA-ADMINS-ROLE",
                    "displayName": "RIPA-ADMINS-ROLE",
                    "id": "624d1ecc-933a-4d68-8b4c-b9a8ce343824",
                    "isEnabled": true,
                    "lang": null,
                    "origin": "Application",
                    "value": "RIPA-ADMINS-ROLE"
                },
                {
                    "allowedMemberTypes": [
                        "User"
                    ],
                    "description": "RIPA-USERS-ROLE",
                    "displayName": "RIPA-USERS-ROLE",
                    "id": "bd1f63c5-7525-4db1-bd97-09def6c07edf",
                    "isEnabled": true,
                    "lang": null,
                    "origin": "Application",
                    "value": "RIPA-USERS-ROLE"
                }
            ],
    23. Select the "Save" button at the top of the screen
    24. Select the "Token Configuration" blade from the left side of the screen
    25. Select the "Add optional claims" button
    26. Select the "Id" option and choose the following items from the list
        1.  accnt
        2.  auth_time
        3.  email
        4.  family_name
        5.  given_name
        6.  preferred_username
    27. Select the "Add" button at the bottom of the flyout
        1.  You may receive another dialog asking about Microsoft Graph
            1.  Select the checkbox
            2.  Select "Add"
    28. Select the "Add group claims" button
    29. Select the "Groups assigned to the application"
    30. Under the "ID" option below, make sure to select "sAMAccountName"
    31. Select the "Add" button at the bottom of the flyout
    32. Select the "API Permission" blade on the left side of the screen
    33. Select the "Add a permission" button
    34. On the flyout select "My APIs" tab
    35. You should be presented with your App Registration (RIPA-AUTH-PROC in my example), select this item
    36. Select the permission we previously created "user_impersonation"
    37. Select the "Add permission" at the bottom of the flyout
    38. Select the "Grant admin consent for {your tenant name}" button
    39. Select "Yes" as the final step

You have now created and App Registration and Enterprise Application that is CSSA RIPA compliant.

### Configuring Authentication & Authorization Manually

The CSSA RIPA Marketplace deployment will promt you for your App Registration & tenant details during the "Athentication" tab of the deployment wizard. If you use the previously create App Registration during this step then no other configuration is rquired on your part.

Follow the guide below to update or modify your authentication scheme manually if you need to at any time.

Each of the areas below need to be configured similarly using the App Registration and tenant details that you wish to use for this instance.

    1. The User Interface config.json document
       1. Open your browser to the Azure portal where you installed CSSA RIPA
       2. Navigate to the Resource Group of the deployment
       3. Search for the storage account that ends with the letters "uisa"
          1. In my example installtion example-ripa.cssa.cloud the storage account name would be "exampleripauisa"
       4. In the storage account select the "Containers" blade from the left side of the screen
       5. Select the "$web" container
       6. Select the "config.json" file
       7. Select the "Edit" button of the container details
       8. In the "Authentication" node, set the following values
          1. ClientId - this is the client id of the App Registration previously created
          2. AuthorityUrl - this is the combination of your tenants login URL and TenantId
                Example: "https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000"
             1. If you are using Azure US Government the login URL is most likely ".us" url vs ".com" url
          3. TenantId - this is your tenant id
          4. PrimaryDomain - this is the primary domain name of your tenant (sdsheriff.gov for example)
    2. The API Management (APIM) inbound policies
       1. Open your browser to the Azure portal where you installed CSSA RIPA
       2. Navigate to the Resource Group of the deployment
       3. Select for the APIM instance that deployed with the application
       4. Select the "APIs" blade from the left side of the screen
       5. Select "All APIs" blade
       6. In the "Inbound processing" section select the "</>" button
       7. In the Json update the "openid-config url" with your tenants login Url and the "audience" to reflect your App Registrations ClientId

            <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid." require-expiration-time="true" require-scheme="Bearer" require-signed-tokens="true" clock-skew="240" output-token-variable-name="openid_token">
                <openid-config url="https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000/.well-known/openid-configuration" />
                <audiences>
                    <audience>00000000-0000-0000-0000-000000000000</audience>
                </audiences>
                <required-claims>
                    <claim name="roles" match="any">
                        <value>RIPA-ADMINS-ROLE</value>
                        <value>RIPA-USERS-ROLE</value>
                    </claim>
                </required-claims>
            </validate-jwt>

    3. The Azure Functions configuration settings
       1. For each of the deployed functions (resources that the name ends with "-fa")
          1. *-stop-fa
          2. *-submission-fa
          3. *-userprofile-fa
       2. Open your browser to the Azure portal where you installed CSSA RIPA
       3. Navigate to the Resource Group of the deployment
       4. Select one of the Function Apps listed above
       5. Select the "Configuration" blade from the left side of the screen
       6. Set the Appregistration & tenant details for each of the following settings
          1. ripa_app_id == App Registration ClientId
          2. ripa_tenant_id == your tenant id
          3. ripa_tenant_name == the primary domain name of your tenant
       7. Follow #6 instructions for each Function listed above
