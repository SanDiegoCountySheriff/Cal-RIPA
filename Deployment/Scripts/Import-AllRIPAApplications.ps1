
Write-Host "Installing Az.ApiManagement"
Install-Module Az.ApiManagement -Repository PSGallery -AllowClobber -Force

Write-Host "Installing Az.Resources"
Install-Module Az.Resources -Repository PSGallery -AllowClobber -Force

Write-Host "Installing Az.Accounts"
Install-Module Az.Accounts -Repository PSGallery -AllowClobber -Force

Write-Host "Importing Az.ApiManagement"
Import-Module Az.ApiManagement -Force

Write-Host "Importing Az.Resources"
Import-Module Az.Resources -Force

Write-Host "Importing Az.Accounts"
Import-Module Az.Accounts -Force

Write-Host "Importing Import-ApimApis.psm1"
Import-Module .\Import-ApimApis.psm1 -Force

# $env:CSSA_SP_APP_ID="be959af2-bda9-4eb1-abb2-4c2776d8acd3"
# $env:CSSA_SP_SECRET="WD9~MZaI3Q0x4g_~930mARvmqq2S-U~YbU"
# $env:CSSA_TENANT_ID="bbfa7b1d-b413-4c37-8a47-6044c982b892"
# $env:RESOURCE_GROUP_NAME="test2-rg"
# $env:APIM_INSTANCE_NAME="l0103-ripa-apim"

# $env:AUTH_SP_APP_ID="affa6f37-ebea-4197-9998-17334ea94587"
# $env:AUTH_TENANT_ID="bbfa7b1d-b413-4c37-8a47-6044c982b892"
# $env:AUTH_AUTHORITY="https://login.microsoftonline.com/$env:AUTH_TENANT_ID"
# $env:AUTH_PRIMARY_DOMAIN="cssaripatest.onmicrosoft.us"
# $env:APIM_INSTANCE_URL="https://l0103-ripa-apim.azure-api.us"
# $env:DEFAULT_COUNTY="San Diego"

# $env:AGENCY_ABBREVIATION="l0103"
# $env:APPLICATION_NAME="ripa"

apt-get update
apt-get --yes upgrade
apt install curl
curl -sL https://aka.ms/InstallAzureCLIDeb | bash

$apiAppNames =  @('domain','stop','submission','textanalytics','userprofile')
$webAppName = "$env:AGENCY_ABBREVIATION$env:APPLICATION_NAME" + "uisa"

write-host "logging into azure powershell"
[string]$username = $env:CSSA_SP_APP_ID
[string]$userpassword = $env:CSSA_SP_SECRET
[securestring]$secstringpassword = convertto-securestring $userpassword -asplaintext -force
[pscredential]$credobject = new-object system.management.automation.pscredential ($username, $secstringpassword)
connect-azaccount -environment azureusgovernment -tenant $env:CSSA_TENANT_ID -serviceprincipal -credential $credobject

write-host "checking login context"
get-azcontext

write-host "logging into azure cli"
az cloud set -n azureusgovernment 
az login --service-principal --tenant $env:CSSA_TENANT_ID -u $env:CSSA_SP_APP_ID -p $env:CSSA_SP_SECRET

write-host "checking cli login context"
az account show

Write-Host "CSSA_SP_APP_ID: $env:CSSA_SP_APP_ID"
Write-Host "CSSA_TENANT_ID: $env:CSSA_TENANT_ID"
Write-Host "RESOURCE_GROUP_NAME: $env:RESOURCE_GROUP_NAME"
Write-Host "APIM_INSTANCE_NAME: $env:APIM_INSTANCE_NAME"

Write-Host "AUTH_SP_APP_ID: $env:AUTH_SP_APP_ID"
Write-Host "AUTH_TENANT_ID: $env:AUTH_TENANT_ID"
Write-Host "AUTH_AUTHORITY: $env:AUTH_AUTHORITY"
Write-Host "AUTH_PRIMARY_DOMAIN: $env:AUTH_PRIMARY_DOMAIN"
Write-Host "APIM_INSTANCE_URL: $env:APIM_INSTANCE_URL"
Write-Host "DEFAULT_COUNTY: $env:DEFAULT_COUNTY"

Write-Host "AGENCY_ABBREVIATION: $env:AGENCY_ABBREVIATION"
Write-Host "APPLICATION_NAME: $env:APPLICATION_NAME"
Write-Host "STORAGE_ACCOUNT_NAME: $env:STORAGE_ACCOUNT_NAME"

foreach ($appName in $apiAppNames) {

    Write-Host "Deploying & Importing API: $appName"

    Write-Host "Getting API Version info"
    $apiApplication = "$env:AGENCY_ABBREVIATION-$env:APPLICATION_NAME-$appName-fa"
    Write-Host "apiApplication: $apiApplication"

    $APIVersion = ((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions[0]
    Write-Host "APIVersion: $APIVersion"

    Write-Host "Getting existing IP restrictions"
    $WebAppConfig = (Get-AzResource -ResourceType "Microsoft.Web/sites/config" -ResourceGroupName $env:RESOURCE_GROUP_NAME -ApiVersion $APIVersion -Name $apiApplication)
    Write-Host "Web app config found"
    $existingIpSecurityRestrictions = $WebAppConfig.Properties.ipSecurityRestrictions
    Write-Host "Existing Ip restrictions"
    Write-Host $existingIpSecurityRestrictions
    Write-Host

    Write-Host "Removing existing IP restriction"
    $WebAppConfig.properties.ipSecurityRestrictions = @()
    $WebAppConfig | Set-AzResource -ApiVersion $APIVersion -Force | Out-Null

    Write-Host "Deploying function $apiApplication"
    az functionapp deployment source config-zip -g $env:RESOURCE_GROUP_NAME --src "./$appName.zip" -n $apiApplication

    Write-Host "Importing $appName OpenAPI into APIM"
    Import-FunctionApi -ResourceGroupName $env:RESOURCE_GROUP_NAME -ServiceName $env:APIM_INSTANCE_NAME -FunctionName $apiApplication -ApiTag $appName

    Write-Host "Resetting IP restriction"
    $WebAppConfig = (Get-AzResource -ResourceType Microsoft.Web/sites/config -ResourceGroupName $env:RESOURCE_GROUP_NAME -ApiVersion $APIVersion -Name $apiApplication)
    $WebAppConfig.properties.ipSecurityRestrictions = $existingIpSecurityRestrictions
    $WebAppConfig | Set-AzResource -ApiVersion $APIVersion -Force | Out-Null
}

# Get the APIM Context & primary access key
$apimContext = New-AzApiManagementContext -ResourceGroupName $env:RESOURCE_GROUP_NAME -ServiceName $env:APIM_INSTANCE_NAME -ErrorAction Stop
$apimMasterKeys = Get-AzApiManagementSubscriptionKey -Context $apimContext -SubscriptionId "Master"
$apimPrimaryKey = $apimMasterKeys.PrimaryKey

Write-Host "Publishing UI package"
Expand-Archive -Path "./ui.zip" -DestinationPath "./" -Force
az storage blob upload-batch --timeout 300 -d '$web' --account-name $env:STORAGE_ACCOUNT_NAME -s './dist'

Write-Host "Creating config.json"
$configFilePath = "./config.json"
$configJson = Get-Content -Path $configFilePath
$configJson = $configJson.Replace("__AUTH_SP_APP_ID__", $env:AUTH_SP_APP_ID)
$configJson = $configJson.Replace("__AUTH_AUTHORITY__", $env:AUTH_AUTHORITY)
$configJson = $configJson.Replace("__AUTH_TENANT_ID__", $env:AUTH_TENANT_ID)
$configJson = $configJson.Replace("__AUTH_PRIMARY_DOMAIN__", $env:AUTH_PRIMARY_DOMAIN)
$configJson = $configJson.Replace("__APIM_INSTANCE_URL__", $env:APIM_INSTANCE_URL)
$configJson = $configJson.Replace("__APIM_MASTER_SUBSCRIPTION_KEY__", $apimPrimaryKey)
$configJson = $configJson.Replace("__DEFAULT_COUNTY__", $env:DEFAULT_COUNTY)

Write-Host "Saving config.json"
Set-Content -Path $configFilePath -Value $configJson -Force

Write-Host "Uploading config.json"
az storage blob upload --timeout 300 --account-name $env:STORAGE_ACCOUNT_NAME -n "config.json" -c '$web' -f './config.json' 

Write-Host "Finished deploying & importing applications"