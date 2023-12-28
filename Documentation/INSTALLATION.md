# Cal-RIPA Installation

## How to install and configure your RIPA application instance

### Required steps

1. Set up Authentication

   - First you should follow the [Create Authentication Scheme instructions](./AUTHENTICATION.md) to create an Azure Active Directory OAuth/OpenID-Connect App Registration, Admin & User groups and the associated Roles.

2. Deploy App

   - Then go to the Azure US Government portal to install RIPA from your "Private" Marketplace offering. You can find detailed instruction here: [Azure Private Marketplace](./MARKETPLACE.md)

3. Import CLEW Data

   - Once the app is deployed and can be logged into, it's time to set up the lookup lists for Schoold, Cities and Offense Codes. Follow the [Domain Lists](./DOMAIN-LISTS.md) instructions to import lookup lists.

4. Import Existing Users

   - Before users log in, you must import all existing RIPA users at your agency into the system if you are setting up a production environment. Go to [User Import](./USER-IMPORT.md) for instructions about how to import existing RIPA users.

5. Set up sFTP credentials with DoJ

   - Before you submit stops from your system to CA DoJ you will have to get credentials. Go to [DoJ Configuration](./DOJ-CONFIGURATION.md) for detailed instruction about how to set up your connection to the DoJ sFTP site.

6. Add users to AAD Groups
   - Add users to "RIPA-USERS" and/or "RIPA-ADMINS" groups in your Azure AD tenant. You may have used different group names when setting up. If you have existing user groups that you would rather use, you can do this mapping in the Azure AD Enterprise App Users and Groups setting. Note that group nesting is not supported.

### Optional steps

- Set up Beats: Follow the [Domain Lists](./DOMAIN-LISTS.md) instructions as well as [Beats](./BEATS.md.md)
- Set up Agency Questions: [Agency Questions](./DOJ-CONFIGURATION.md)
- Set up Templates: [Templates](./STOP-TEMPLATES.md). There is additional information about 2024 regulation testing templates here: [2024 Templates](./2024-REGULATION-UPDATE-DOJ-TESTING.md)

## What if I need to delete my installation and redo

There are a few services/resources in Azure that do not fully "delete" when you delete them. Why would this be? In order to allow users to recover certain critical resources in the event that they are deleted by "accident".

### Instruction on how to completely remove resources that get "Soft deleted"

    az cloud set -n AzureUSGovernment
    az login --tenant {your tenant id}
    az account set -s {your subscription id}

    az keyvault delete -g {resource group where kv is deployed} -n {your key vault name}
    az keyvault purge -n {your key vault name} -l {example: azgovarizona}

    az account get-access-token --resource "https://management.usgovcloudapi.net"

    // using tools like Postman, Ready-API or Fiddler, send a "DELETE" request to the Azure Management API backplane.
    DELETE https://management.usgovcloudapi.net/subscriptions/{your subscription id}/providers/Microsoft.ApiManagement/locations/usgovarizona/deletedservices/{your apim instance name}?api-version=2020-06-01-preview
    Authorization: Bearer {the bearer token returned from get--access-toekn response}
