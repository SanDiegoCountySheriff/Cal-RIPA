# Variables
$tenantId           = "a44e5271-a297-4daf-a3a9-f90a3146f3f5"
$baseSubscription   = "c74e04b6-0cd7-4778-863e-34654eb49270" 
$environment        = "dev" # shd, dev, uat, prd, sbx(?)
$env_initial        = "d" #s, d, q, p

# get principal user info from keyvayult
$shdKeyVaultSubscription = "5edf03ce-623c-47c3-b15f-dab2be8a319e"
$shdKeyVaultName = "kv-cssa-it-ops-shd-001"
$userObjectId = ((az keyvault secret show --subscription $shdKeyVaultSubscription --vault-name $shdKeyVaultName -n cssa-marketplace-deployment-spn) | ConvertFrom-Json).value
$userPassword = ((az keyvault secret show --subscription $shdKeyVaultSubscription --vault-name $shdKeyVaultName -n cssa-marketplace-deployment-pwd) | ConvertFrom-Json).value

## Sign into Azure w/ Service Principal
Write-Host "Logging into Azure Cloud"
az cloud set -n AzureUSGovernment
$subscriptions = (az login --tenant $tenantId --service-principal -u $userObjectId -p $userPassword | ConvertFrom-Json)
Write-Host "Login complete"

# get all Subscriptions
$subscriptions = (az account list) | ConvertFrom-Json

# get all Ripa-Dashboard Groups
$allGroups = (az ad group list | ConvertFrom-Json)
$ripaDashboardReaders = $allGroups | Where-Object -FilterScript { 
        $_.displayName -like "*RIPADashboard*" -and 
        $_.displayName -ne "CSSA-MasterReader-RIPADashboard-Users" 
    }

# values for db connection
$databaseName = "mdw-db"
$keyVaultName = "sdsd-ripa-etl-" + $env_initial + "-kv"
$sqlServerName = "sdsd-ripa-etl-" + $env_initial + "-sql.database.usgovcloudapi.net"
$dbUserName = ((az keyvault secret show --subscription $baseSubscription --vault-name $keyVaultName -n sec-sql-server-admin-user) | ConvertFrom-Json).value
$dbPassword = ((az keyvault secret show --subscription $baseSubscription --vault-name $keyVaultName -n sec-sql-server-admin-pwd) | ConvertFrom-Json).value

# connect to sql db
Write-Host "Connecting to the database as user" $dbUserName
$sqlConn = New-Object System.Data.SqlClient.SqlConnection
$sqlConn.ConnectionString = "Server=$sqlServerName,1433;User id=$dbUserName; Password=$dbPassword;Initial Catalog=$databaseName"
$sqlConn.Open()
Write-Host "Connected to database"

# iterate thru groups
foreach ($group in $ripaDashboardReaders) {

    # get agency subscription
    Write-Host "group:" $group.displayName

    $agency = $group.displayName.Split("-")[0]; # take first section of display name to get agency name
    $agencySubscription = $subscriptions | Where-Object -FilterScript { $_.name -eq "$agency-$environment" }
    Write-Host "subscription:" $agencySubscription.displayName $agencySubscription.id
    
    # get the ORI code
    $subid = "/subscriptions/" + $agencySubscription.id
    $tagList = (az tag list --resource-id $subid) | ConvertFrom-Json
    $dimOri = $tagList.properties.tags.agency_ori
    
    # get group members
    $members = (az ad group member list -g $group.ObjectId | ConvertFrom-Json) | Where-Object -FilterScript {
            $_.userType -eq "Member"
        }    

    # define sql statement
    $sql="if exists (select 1 from [model].[dimSecurity] where AD_ObjectID = @ObjectId and AD_Group = @Group)
    begin
        update [model].[dimSecurity]
        set AD_Group = @Group, Ori = @Ori, IsEnabled = 1, AD_Name = @Name, AD_Email = @Email, AD_ObjectGroupID = @ObjectGroupId
        where AD_ObjectID = @ObjectId and AD_Group = @Group
    end
    else
    begin
        insert into [model].[dimSecurity](AD_Group, Ori, IsEnabled, AD_Name, AD_ObjectID, AD_Email, AD_ObjectGroupID)
        values (@Group, @Ori, 1, @Name, @ObjectId, @Email, @ObjectGroupId)
    end"

    # prepare the command
    $sqlcmd = New-Object Data.SqlClient.SqlCommand
    $sqlcmd.Connection = $sqlConn
    $sqlcmd.CommandText = $sql

    # itterate thru members in this group
    foreach($member in $members) {
        try{
            $memberMail = $member.mail
            if ($null -eq $memberMail) { $memberMail = [System.DBNull]::Value }

            # add member data as params
            $sqlcmd.Parameters.AddWithValue("@ObjectId", $member.objectId) | Out-Null
            $sqlcmd.Parameters.AddWithValue("@Group", $group.displayName) | Out-Null
            $sqlcmd.Parameters.AddWithValue("@Ori", $dimOri) | Out-Null
            $sqlcmd.Parameters.AddWithValue("@Name", $member.displayName) | Out-Null
            $sqlcmd.Parameters.AddWithValue("@Email", $memberMail) | Out-Null
            $sqlcmd.Parameters.AddWithValue("@ObjectGroupId", $group.objectId) | Out-Null

            # execute command and clear for next member
            $sqlcmd.ExecuteNonQuery() | Out-Null
            $sqlcmd.Parameters.Clear()
            
            # ack out
            Write-Host $member.displayName "added to db"
        }
        catch {
            # nack out
            Write-Host $_
            Write-Error $member.displayName "was not added to db" 

        }
        
    }    
}

# close out
$sqlConn.Close()
Write-Host "Finished processing"