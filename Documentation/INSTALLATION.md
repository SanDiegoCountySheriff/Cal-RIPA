# Cal-RIPA Uninstallation

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
    Authorization: Bearer {the bearer token returned from get--access-token response}
