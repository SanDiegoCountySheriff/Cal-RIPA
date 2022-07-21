# Write-Host "Installing Az v6.6.0 due to Az.Account version in image"
# Install-Module Az -Repository PSGallery -RequiredVersion 6.6.0 -AllowClobber -Force

# Write-Host "Installing Az"
# Install-Module Az -Repository PSGallery -AllowClobber -Force

# Write-Host "Importing Az"
# Import-Module Az -Force

# Write-Host "Importing Import-ApimApis.psm1"
# Get-ChildItem -Filter "*Import-ApimApis.psm1" | Rename-Item -NewName "Import-ApimApis.psm1"
# Import-Module .\Import-ApimApis.psm1 -Force

apt-get update
apt-get --yes upgrade
apt install curl
curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# $env:CSSA_SP_APP_ID="12341234-1234-1234-1234-123412341234"
# $env:CSSA_SP_SECRET="*****************************"
# $env:CSSA_TENANT_ID="12341234-1234-1234-1234-123412341234"
# $env:ETL_SUBSCRIPTION_ID="12341234-1234-1234-1234-123412341234"

# $env:APPLICATION="ripa"
# $env:AGENCY_ABBREVIATION="sdsd"
# $env:ENVIRONMENT_TYPE="PROD"
# $env:DASHBOARD_COSMOS_PRIMARY_KEY # do not log

Write-Host "CSSA_SP_APP_ID: $env:CSSA_SP_APP_ID"
Write-Host "CSSA_TENANT_ID: $env:CSSA_TENANT_ID"
Write-Host "APP_RESOURCE_GROUP_NAME: $env:APP_RESOURCE_GROUP_NAME"
Write-Host "DEPLOY_WEB_CONFIG_JSON: $env:DEPLOY_WEB_CONFIG_JSON"

# Write-Host "logging into azure powershell"
# [string]$username = $env:CSSA_SP_APP_ID
# [string]$userpassword = $env:CSSA_SP_SECRET
# [securestring]$secstringpassword = convertto-securestring $userpassword -asplaintext -force
# [pscredential]$credobject = new-object system.management.automation.pscredential ($username, $secstringpassword)
# Connect-AzAccount -environment azureusgovernment -Tenant $env:CSSA_TENANT_ID -Subscription $env:ETL_SUBSCRIPTION_ID -ServicePrincipal -Credential $credobject

# Write-Host "checking login context"
# Get-AzContext

Write-Host "logging into azure cli"
az cloud set -n azureusgovernment 
az login --service-principal --tenant $env:CSSA_TENANT_ID -u $env:CSSA_SP_APP_ID -p $env:CSSA_SP_SECRET
az account set -s "$env:ETL_SUBSCRIPTION_ID"

Write-Host "checking cli login context"
az account show


function SaveDatabaseRecord($tableName, $dataRecord)
{
    Write-Host "Checking if exists:" $tableName
    if($dataRecord -eq $null)
    {
        Write-Host "Inserting new record for table:" $tableName
        $columnNames = "[DataSourceName], [DataSourceType], [DatabaseServerName], [DatabaseName], [DatabaseTableName], [DatabaseUserNamePasswordSecret], [DataSourceAuthenticationType], [IsEnabled], [IsIncremental], [Raw2Stage]"
        $insertStatement1 = "INSERT [adf].[DataSource] (" + $columnNames + ") VALUES ("
        $insertStatement2 = $insertStatement1 + "'$dataSourceName', 'cosmosdb', 'https://" + $sqlServerName + ":1433/', 'ripastops', '$tableName', 'sec-ripa-cosmosdb-$dataSourceName-cdb-acccess-key', 'Account Key', 1, 0, 1)" 
        
        Write-Host $insertStatement2
        $sqlcmd.CommandText = $insertStatement2
        $sqlcmd.ExecuteNonQuery()
    }
    else
    {
        Write-Host "Updating record for table:" $tableName
        $updateCommand = "UPDATE adf.DataSource SET DatabaseServerName='$ripaDatabaseUrl', DatabaseUserNamePasswordSecret='$ripaDbSecret' WHERE DatabaseName='ripastops' AND DataSourceName='$dataSourceName' AND DatabaseTableName='$tableName'"
        
        Write-Host $updateCommand
        $sqlcmd.CommandText = $updateCommand
        $sqlcmd.ExecuteNonQuery()
    }
}

$tenantId = $env:CSSA_TENANT_ID
$subscriptionId = $env:ETL_SUBSCRIPTION_ID

if($env:ENVIRONMENT_TYPE.Substring(0,1).ToLower() -ne "prod")
{
    $keyVaultName = $env:CSSA_DASHBOARD_KEY_VAULT_PREFIX + $env:ENVIRONMENT_TYPE.Substring(0,1).ToLower() + $env:CSSA_DASHBOARD_KEY_VAULT_SUFFIX
    $sqlServerName = $env:CSSA_DASHBOARD_SQL_SERVER_PREFIX + $env:ENVIRONMENT_TYPE.Substring(0,1).ToLower() + $env:CSSA_DASHBOARD_SQL_SERVER_SUFFIX
}
else 
{
    $keyVaultName = $env:CSSA_DASHBOARD_KEY_VAULT_PROD   
    $sqlServerName = $env:CSSA_DASHBOARD_SQL_SERVER_PROD
}

$databaseName = "mdw-db"
$dataSourceName = $env:AGENCY_ABBREVIATION + "-" + $env:APPLICATION_NAME
$dashboardSecretKey = $env:DASHBOARD_COSMOS_PRIMARY_KEY 

# log variables
Write-Host "tennantID:" $tenantId
Write-Host "subscriptionId:" $subscriptionId
Write-Host "keyVaultName:" $keyVaultName
Write-Host "sqlServerName:" $sqlServerName
Write-Host "databaseName:" $databaseName
Write-Host "dataSourceName:" $dataSourceName

Write-Host "ETL_SUBSCRIPTION_ID: $env:ETL_SUBSCRIPTION_ID"
Write-Host "CSSA_SP_APP_ID: $env:CSSA_SP_APP_ID"
Write-Host "CSSA_TENANT_ID: $env:CSSA_TENANT_ID"
Write-Host "ENVIRONMENT_TYPE" $env:ENVIRONMENT_TYPE
Write-Host "AGENCY_ABBREVIATION" $env:AGENCY_ABBREVIATION
Write-Host "APPLICATION_NAME" $env:APPLICATION_NAME

$whereClause = "WHERE DatabaseName='ripastops' AND DataSourceName='$dataSourceName' AND DatabaseTableName IN ('stop', 'userprofile') ORDER BY DatabaseTableName ASC”

$ripaDatabaseUrl = "https://" + $sqlServerName + ":1433/"
$ripaDbSecret = "sec-ripa-cosmosdb-$dataSourceName-cdb-acccess-key"

Write-Host "Reading database connection details from Azure Key Vault"

$dbUserName = ((az keyvault secret show --subscription $subscriptionId --vault-name $keyVaultName -n $env:KV_SQL_SERVER_USER) | ConvertFrom-Json).value
$dbPassword = ((az keyvault secret show --subscription $subscriptionId --vault-name $keyVaultName -n $env:KV_SQL_SERVER_PWD) | ConvertFrom-Json).value

Write-Host "Connecting to the database as user" $dbUserName
if($dbPassword -eq $null){
    Write-Host "Connection being made with password"
}
else {
    Write-Host "No SQL password provided"
}

$sqlConn = New-Object System.Data.SqlClient.SqlConnection
$sqlConn.ConnectionString = “Server=tcp:$sqlServerName,1433;User ID=$dbUserName; Password=$dbPassword;Initial Catalog=$databaseName;”
$sqlConn.Open()

Write-Host "Connected to the database"

$sqlcmd = $sqlConn.CreateCommand()
$query = “SELECT * FROM adf.DataSource " + $whereClause 
$sqlcmd.CommandText = $query

$adp = New-Object System.Data.SqlClient.SqlDataAdapter $sqlcmd

$data = New-Object System.Data.DataSet
$adp.Fill($data) | Out-Null

Write-Host "Data rows retrieved:" $data.Tables[0].Rows.Count

$stopRecord = ($data.Tables[0].Rows | Where-Object {$_.DatabaseTableName -eq "stop"})
$userprofileRecord = ($data.Tables[0].Rows | Where-Object {$_.DatabaseTableName -eq "userprofile"})

Write-Host "Checking and updating values"
SaveDatabaseRecord -tableName "stop" -dataRecord $stopRecord
SaveDatabaseRecord -tableName "userprofile" -dataRecord $userprofileRecord

$sqlConn.Close()
Write-Host "Closed the connection"

# place CosmosDB key into etl kv of another subscription
$dashboardSecretName = $dataSourceName + "-cosmos-key"
Write-Host "Writing CosmosDB Key to" $keyVaultName
az keyvault secret set --name $dashboardSecretName --value $dashboardSecretKey --vault-name $keyVaultName 1> /dev/null #prevent writing secret to log
Write-Host "Finished writing" $dashboardSecretName "to" $keyVaultName