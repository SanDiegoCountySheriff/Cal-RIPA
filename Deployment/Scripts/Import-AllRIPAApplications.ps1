Write-Host "Installing Az v6.6.0 due to Az.Account version in image"
Install-Module Az -Repository PSGallery -RequiredVersion 6.6.0 -AllowClobber -Force

# Write-Host "Installing Az"
# Install-Module Az -Repository PSGallery -AllowClobber -Force

Write-Host "Importing Az"
Import-Module Az -Force

Write-Host "Importing Import-ApimApis.psm1"
Get-ChildItem -Filter "*Import-ApimApis.psm1" | Rename-Item -NewName "Import-ApimApis.psm1"
Import-Module .\Import-ApimApis.psm1 -Force

apt-get update
apt-get --yes upgrade
apt install curl
curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# $env:CSSA_SP_APP_ID="12341234-1234-1234-1234-123412341234"
# $env:CSSA_SP_SECRET="*****************************"
# $env:CSSA_TENANT_ID="12341234-1234-1234-1234-123412341234"
# $env:APP_SUBSCRIPTION_ID="12341234-1234-1234-1234-123412341234"
# $env:APP_RESOURCE_GROUP_NAME="some-resource-group"

## UI config.json settings 
# $env:AUTH_SP_APP_ID="12341234-1234-1234-1234-123412341234"
# $env:AUTH_TENANT_ID="12341234-1234-1234-1234-123412341234"
# $env:AUTH_AUTHORITY="https://login.microsoftonline.com/$env:AUTH_TENANT_ID"
# $env:AUTH_PRIMARY_DOMAIN="somedomain.gov"
# $env:DEFAULT_COUNTY="Some County"

# $env:AGENCY_ABBREVIATION="sdsd"
# $env:ENVIRONMENT_TYPE="PROD"
# $env:ENABLE_BEATS="false"
# $env:ENABLE_STOP_DEBUGGER="false"
# $env:DEPLOY_WEB_CONFIG_JSON="false"

Write-Host "CSSA_SP_APP_ID: $env:CSSA_SP_APP_ID"
Write-Host "CSSA_TENANT_ID: $env:CSSA_TENANT_ID"
Write-Host "APP_RESOURCE_GROUP_NAME: $env:APP_RESOURCE_GROUP_NAME"
Write-Host "DEPLOY_WEB_CONFIG_JSON: $env:DEPLOY_WEB_CONFIG_JSON"

Write-Host "logging into azure powershell"
[string]$username = $env:CSSA_SP_APP_ID
[string]$userpassword = $env:CSSA_SP_SECRET
[securestring]$secstringpassword = convertto-securestring $userpassword -asplaintext -force
[pscredential]$credobject = new-object system.management.automation.pscredential ($username, $secstringpassword)
Connect-AzAccount -environment azureusgovernment -Tenant $env:CSSA_TENANT_ID -Subscription $env:APP_SUBSCRIPTION_ID -ServicePrincipal -Credential $credobject

Write-Host "checking login context"
Get-AzContext

Write-Host "logging into azure cli"
az cloud set -n azureusgovernment 
az login --service-principal --tenant $env:CSSA_TENANT_ID -u $env:CSSA_SP_APP_ID -p $env:CSSA_SP_SECRET
az account set -s $env:APP_SUBSCRIPTION_ID

Write-Host "checking cli login context"
az account show

$apimResource = (az resource list -g $env:APP_RESOURCE_GROUP_NAME --resource-type "Microsoft.ApiManagement/service") | ConvertFrom-Json
$apimInstanceInfo = (az apim show -g $env:APP_RESOURCE_GROUP_NAME -n $apimResource[0].name) | ConvertFrom-Json

$apimInstanceName = $apimInstanceInfo.name
$apimInstanceUrl = $apimInstanceInfo.gatewayUrl
Write-Host "Using APIM:" $apimInstanceName "-" $apimInstanceUrl

$functionNames = (az functionapp list -g $env:APP_RESOURCE_GROUP_NAME --query "[].{Name:name}" -o json) | ConvertFrom-Json
foreach ($functionName in $functionNames) {
    
    $functionNameParts = $functionName.Name.Split("-")
    $appName = $functionNameParts[$functionNameParts.Length - 2]

    Write-Host "Deploying & Importing API: $appName"

    Write-Host "Getting API Version info:" $functionName.Name

    $APIVersion = ((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions[0]
    Write-Host "APIVersion: $APIVersion"

    Write-Host "Getting existing IP restrictions"
    $WebAppConfig = (Get-AzResource -ResourceType "Microsoft.Web/sites/config" -ResourceGroupName $env:APP_RESOURCE_GROUP_NAME -ApiVersion $APIVersion -Name $functionName.Name)
    $existingIpSecurityRestrictions = $WebAppConfig.Properties.ipSecurityRestrictions
    Write-Host "Existing Ip restrictions"
    Write-Host $existingIpSecurityRestrictions
    Write-Host

    Write-Host "Removing existing IP restriction"
    $WebAppConfig.properties.ipSecurityRestrictions = @()
    $WebAppConfig | Set-AzResource -ApiVersion $APIVersion -Force | Out-Null

    Write-Host "Deploying function:" $functionName.Name
    $fileName = (Get-ChildItem -Filter "*$appName.zip").Name
    Write-Host "Deploying package:" $fileName
    az functionapp deployment source config-zip -g $env:APP_RESOURCE_GROUP_NAME --src "./$fileName" -n $functionName.Name

    Write-Host "Updating Function Runtime"
    az functionapp config appsettings set --name $functionName.Name --resource-group $env:APP_RESOURCE_GROUP_NAME --settings "FUNCTIONS_EXTENSION_VERSION=~4"
    az functionapp config set --name $functionName.Name --resource-group $env:APP_RESOURCE_GROUP_NAME --linux-fx-version '"DOTNET|8.0"'

    Start-Sleep -Seconds 45

    Write-Host "Importing $appName OpenAPI into APIM"
    Import-FunctionApi -ResourceGroupName $env:APP_RESOURCE_GROUP_NAME -ServiceName $apimInstanceName -FunctionName $functionName.Name -ApiTag $appName

    Write-Host "Resetting IP restriction"
    $WebAppConfig = (Get-AzResource -ResourceType Microsoft.Web/sites/config -ResourceGroupName $env:APP_RESOURCE_GROUP_NAME -ApiVersion $APIVersion -Name $functionName.Name)
    $WebAppConfig.properties.ipSecurityRestrictions = $existingIpSecurityRestrictions
    $WebAppConfig | Set-AzResource -ApiVersion $APIVersion -Force | Out-Null
}

# Get the APIM Context & primary access key
$apimContext = New-AzApiManagementContext -ResourceGroupName $env:APP_RESOURCE_GROUP_NAME -ServiceName $apimInstanceName -ErrorAction Stop
$apimMasterKeys = Get-AzApiManagementSubscriptionKey -Context $apimContext -SubscriptionId "Master"
$apimPrimaryKey = $apimMasterKeys.PrimaryKey

Write-Host "Publishing UI package"
$uiStorageAccountName = ((az storage account list -g $env:APP_RESOURCE_GROUP_NAME --query "[? contains(name, 'uisa')].{Name:name}" -o json) | ConvertFrom-Json).Name
Write-Host "Publishing to:" $uiStorageAccountName

$fileName = (Get-ChildItem -Path "./" -Filter "*ui.zip").Name
Write-Host "Deploying UI package:" $fileName
Expand-Archive -Path "./$fileName" -DestinationPath "./" -Force
az storage blob upload-batch --overwrite true --timeout 300 -d '$web' --account-name $uiStorageAccountName -s './dist'

if ("True" -eq $env:DEPLOY_WEB_CONFIG_JSON) {
    Write-Host "Creating config.json"
    
    Write-Host "AUTH_SP_APP_ID: $env:AUTH_SP_APP_ID"
    Write-Host "AUTH_TENANT_ID: $env:AUTH_TENANT_ID"
    Write-Host "AUTH_AUTHORITY: $env:AUTH_AUTHORITY"
    Write-Host "AUTH_PRIMARY_DOMAIN: $env:AUTH_PRIMARY_DOMAIN"
    Write-Host "DEFAULT_COUNTY: $env:DEFAULT_COUNTY"
    
    Write-Host "AGENCY_ABBREVIATION: $env:AGENCY_ABBREVIATION"
    Write-Host "ENVIRONMENT_TYPE: $env:ENVIRONMENT_TYPE"
    Write-Host "ENABLE_BEATS: $env:ENABLE_BEATS"
    Write-Host "MODIFY_BEAT_ID: $env:MODIFY_BEAT_ID"
    Write-Host "BEAT_ID_NUMBER_OF_DIGITS: $env:BEAT_ID_NUMBER_OF_DIGITS"
    Write-Host "DISPLAY_REPORTING_EMAIL": $env:DISPLAY_REPORTING_EMAIL
    Write-Host "REPORTING_EMAIL_ADDRESS": $env:REPORTING_EMAIL_ADDRESS
    Write-Host "ENABLE_STOP_DEBUGGER: $env:ENABLE_STOP_DEBUGGER"
    Write-Host "USE_OFFICER_UPN: $env:USE_OFFICER_UPN"
    Write-Host "STOP_DATE_LIMIT_DAYS: $env:STOP_DATE_LIMIT_DAYS"

    # Check for existing config.json to preserve StopDateLimitDays setting during updates
    $existingStopDateLimitDays = $null
    try {
        Write-Host "Checking for existing config.json in storage account"
        $existingConfigPath = "./existing-config.json"
        az storage blob download --account-name $uiStorageAccountName -c '$web' -n "config.json" -f $existingConfigPath 2>$null
        if (Test-Path $existingConfigPath) {
            Write-Host "Found existing config.json, checking for StopDateLimitDays setting"
            $existingConfig = Get-Content -Path $existingConfigPath | ConvertFrom-Json
            if ($existingConfig.Configuration.PSObject.Properties.Name -contains "StopDateLimitDays") {
                $existingStopDateLimitDays = $existingConfig.Configuration.StopDateLimitDays
                Write-Host "Preserving existing StopDateLimitDays value: $existingStopDateLimitDays"
            }
            Remove-Item $existingConfigPath -Force
        }
    } catch {
        Write-Host "No existing config.json found or unable to read it, will use default value"
    }

    $configFilePath = "./$env:TEMPLATE_VERSION_FORMATTED-config.json"
    $configJson = Get-Content -Path $configFilePath
    $configJson = $configJson.Replace("__ENVIRONMENT_TYPE__", $env:ENVIRONMENT_TYPE)
    $configJson = $configJson.Replace("__AUTH_SP_APP_ID__", $env:AUTH_SP_APP_ID)
    $configJson = $configJson.Replace("__AUTH_AUTHORITY__", $env:AUTH_AUTHORITY)
    $configJson = $configJson.Replace("__AUTH_TENANT_ID__", $env:AUTH_TENANT_ID)
    $configJson = $configJson.Replace("__AUTH_PRIMARY_DOMAIN__", $env:AUTH_PRIMARY_DOMAIN)
    $configJson = $configJson.Replace("__APIM_INSTANCE_URL__", $apimInstanceUrl)
    $configJson = $configJson.Replace("__APIM_MASTER_SUBSCRIPTION_KEY__", $apimPrimaryKey)
    $configJson = $configJson.Replace("__DEFAULT_COUNTY__", $env:DEFAULT_COUNTY)
    $configJson = $configJson.Replace("__ENABLE_BEATS__", $env:ENABLE_BEATS)
    $configJson = $configJson.Replace("__MODIFY_BEAT_ID__", $env:MODIFY_BEAT_ID)
    $configJson = $configJson.Replace("__BEAT_ID_NUMBER_OF_DIGITS__", $env:BEAT_ID_NUMBER_OF_DIGITS)
    $configJson = $configJson.Replace("__DISPLAY_REPORTING_EMAIL__", $env:DISPLAY_REPORTING_EMAIL)
    $configJson = $configJson.Replace("__REPORTING_EMAIL_ADDRESS__", $env:REPORTING_EMAIL_ADDRESS)
    $configJson = $configJson.Replace("__ENABLE_STOP_DEBUGGER__", $env:ENABLE_STOP_DEBUGGER)
    $configJson = $configJson.Replace("__USE_OFFICER_UPN__", $env:USE_OFFICER_UPN)
    
    # Handle StopDateLimitDays - preserve existing value if found, otherwise use environment variable or default to null
    $stopDateLimitValue = "null"
    if ($null -ne $existingStopDateLimitDays) {
        # Preserve existing value (could be null, number, etc.)
        $stopDateLimitValue = if ($existingStopDateLimitDays -eq $null) { "null" } else { $existingStopDateLimitDays }
        Write-Host "Using existing StopDateLimitDays value: $stopDateLimitValue"
    } elseif ($env:STOP_DATE_LIMIT_DAYS) {
        # Use environment variable if provided
        $stopDateLimitValue = $env:STOP_DATE_LIMIT_DAYS
        Write-Host "Using environment variable StopDateLimitDays value: $stopDateLimitValue"
    } else {
        # Default to null for new installations
        Write-Host "Using default StopDateLimitDays value: null"
    }
    $configJson = $configJson.Replace('"__STOP_DATE_LIMIT_DAYS__"', $stopDateLimitValue)

    Write-Host "Saving config.json"
    Set-Content -Path $configFilePath -Value $configJson -Force

    Write-Host "Uploading config.json"
    az storage blob upload --overwrite true --timeout 300 --account-name $uiStorageAccountName -n "config.json" -c '$web' -f "./$env:TEMPLATE_VERSION_FORMATTED-config.json" 
}

Write-Host "Finished deploying & importing applications"