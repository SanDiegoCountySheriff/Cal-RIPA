<#
.SYNOPSIS
  <Import .csv file(s) data into Azure Storage Table(s)>
.DESCRIPTION
  <Imports Beats, Cities, Statutes, Schools to Azure Storage Table for RIPA Content>
.PARAMETER <RESOURCE_GROUP_NAME>
    <Resource Group of content storage account is required>
.PARAMETER <STORAGE_ACCOUNT_NAME>
    <RIPA Content Storage Account name is required>
.PARAMETER <CSSA_SP_APP_ID>
    <Service Account username used for Authentication with Azure is required>
.PARAMETER <CSSA_SP_SECRET>
    <Service Account secret used for Authentication with Azure is required>
.PARAMETER <CSSA_TENANT_ID>
    <Service Account tenant used for Authentication with Azure is required>
.PARAMETER <APP_SUBSCRIPTION_ID>
    <Subcription used for RIPA application deployment>
.PARAMETER <tableNames>
    <Can be used to limit the tables used for import: 'Beats','Cities','Statutes','Schools'>
.NOTES
  Version:        1.0
  Author:         <Logan Pope>
  Creation Date:  <06/2021>
  Purpose/Change: Initial script development
  
.EXAMPLE
  <Run script with CSV files relative to script location>
#>

$tableNames = @('Beats','Cities','Statutes','Schools')

$stopWatch = [system.diagnostics.stopwatch]::StartNew()

#region functions
function Get-BeatEntity {
    param (
        $row
    )

    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.Beat;
    $entity.Properties.Add("Id",[int]$row.Beat);
    $entity.Properties.Add("Community",$row.Community);
    $entity.Properties.Add("Command",$row.Command);
        
    if(![string]::IsNullOrWhiteSpace($row.CommandAuditGroup)) {
        $entity.Properties.Add("CommandAuditGroup",$row.CommandAuditGroup);
    }
    if(![string]::IsNullOrWhiteSpace($row.CommandAuditSize)) {
        $entity.Properties.Add("CommandAuditSize",$row.CommandAuditSize);
    }

    return $entity;
}

function Get-CityEntity {
    param (
        $row
    )

    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.City;
    $entity.Properties.Add("State",$row.State);
    $entity.Properties.Add("Name",$row.City);
    $entity.Properties.Add("County",$row.County);

    if(![string]::IsNullOrWhiteSpace($row.'Inactive Date')) {
        $entity.Properties.Add("DeactivationDate",[DateTime]::Parse($row.'Inactive Date'))
    }

    return $entity;
}

function Get-StatuteEntity {
    param (
        $row
    )
    
    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.'Offense Code';
    $entity.Properties.Add("OffenseValidationCD",$row.'Offense Validation CD');
    $entity.Properties.Add("OffenseCode",$row.'Offense Code');
    $entity.Properties.Add("OffenseTxnTypeCD",$row.'Offense Txn Type CD');
    $entity.Properties.Add("OffenseStatute",$row.'Offense Statute');
    $entity.Properties.Add("OffenseTypeOfStatuteCD",$row.'Offense Type of Statute CD');
    $entity.Properties.Add("StatuteLiteral",$row.'Statute Literal 25');
    $entity.Properties.Add("OffenseTypeOfCharge",$row.'Offense Type of Charge');
    $entity.Properties.Add("ALPSCognizantCD",$row.'ALPS Cognizant CD');
    
    if (![string]::IsNullOrWhiteSpace($row.'Offense Literal Identifier CD')) {
        $entity.Properties.Add("OffenseLiteralIdentifierCD",$row.'Offense Literal Identifier CD');
    }

    if (![string]::IsNullOrWhiteSpace($row.'Offense Default Type of Charge')) {
        $entity.Properties.Add("OffenseDefaultTypeOfCharge",$row.'Offense Default Type of Charge');
    }

    if (![string]::IsNullOrWhiteSpace($row.'Offense Degree')) {
        $entity.Properties.Add("OffenseDegree",[int]$row.'Offense Degree');
    }

    if (![string]::IsNullOrWhiteSpace($row.'BCS Hierarchy CD')) {
        $entity.Properties.Add("BCSHierarchyCD", [int]$row.'BCS Hierarchy CD');
    }

    if (![string]::IsNullOrWhiteSpace($row.'Offense Enacted')) {
        if ($row.'Offense Enacted'.Length -eq 10) {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::ParseExact($row.'Offense Enacted', "yyyy-MM-dd", [CultureInfo]::InvariantCulture));
        }
        elseif ($row.'Offense Enacted'.ToString().Length -eq 8) {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::ParseExact($row.'Offense Enacted',"yyyyMMdd", [CultureInfo]::InvariantCulture));
        }
        else {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::FromOADate($row.'Offense Enacted'));
        }
    }

    if (![string]::IsNullOrWhiteSpace($row.'Offense Repealed')) {
        if ($row.'Offense Repealed'.Length -eq 10) {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::ParseExact($row.'Offense Repealed',"yyyy-MM-dd", [CultureInfo]::InvariantCulture));
        }
        elseif ($row.'Offense Repealed'.ToString().Length -eq 8) {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::ParseExact($row.'Offense Repealed',"yyyyMMdd", [CultureInfo]::InvariantCulture));
        }
        else {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::FromOADate($row.'Offense Repealed'));
        }
    }

    return $entity;
}

function Get-SchoolEntity {
    param (
        $row
    )

    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.CDS_Code;
    $entity.Properties.Add("CDSCode",$row.CDS_Code);
    $entity.Properties.Add("Status",$row.Status);
    $entity.Properties.Add("County",$row.County);
    $entity.Properties.Add("District",$row.District);
    $entity.Properties.Add("Name",$row.schoolname);

    return $entity;
}

#endregion

#region modules

$ErrorActionPreference="Stop"

Write-Host "Installing and Importing Az.Resources Module"
Write-Host "Installing Az.Resources Module"
Install-Module Az.Resources -Force
Write-Host "Importing Az.Resources Module"
Import-module Az.Resources -Force

Write-Host "Installing and Importing Az.Storage Module"
Write-Host "Installing Az.Storage Module"
Install-Module Az.Storage -Force
Write-Host "Importing Az.Storage Module"
Import-module Az.Storage -Force

Write-Host "Installing and Importing AzTable Module"
Write-Host "Installing AzTable Module"
Install-Module AzTable -Force
Write-Host "Importing AzTable Module"
Import-Module AzTable -Force

#endregion

#region Azure Login
Write-Host "Logging into Azure"
[string]$userName = $env:CSSA_SP_APP_ID
[string]$userPassword = $env:CSSA_SP_SECRET
[securestring]$secStringPassword = ConvertTo-SecureString $userPassword -AsPlainText -Force
[pscredential]$credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword)
Connect-AzAccount -Environment AzureUsGovernment -Tenant $env:CSSA_TENANT_ID -Subscription $env:APP_SUBSCRIPTION_ID -ServicePrincipal -Credential $credObject

Write-Host "Checking login context"
Get-AzContext

#Add-AzAccount #Interactive login
#endregion

Write-Host "Getting storage account context"
$ctx = (Get-AzStorageAccount -ResourceGroupName $env:RESOURCE_GROUP_NAME -Name $env:STORAGE_ACCOUNT_NAME).Context

foreach ($tableName in $tableNames) {
    Write-Host "Importing $tableName..." 
    if($null -eq (Get-AzStorageTable -Context $ctx | Where-Object { $_.Name -eq $tableName })) {
        $null = New-AzStorageTable -Name $tableName -Context $ctx
    }
    $table = Get-AzStorageTable -Name $tableName -Context $ctx;
    switch ($tableName) {
        'Beats' {
            $csv = Import-Csv -Path (Join-Path -Path (Get-Location) -ChildPath "Beat_Table.csv")
            break;
        }
        'Cities' {
            $csv = Import-Csv -Path (Join-Path -Path (Get-Location) -ChildPath "City_Table.csv")
            break;
        }
        'Statutes' {
            $csv = Import-Csv -Path (Join-Path -Path (Get-Location) -ChildPath "Offense_Table.csv")
            break;
        }
        'Schools' {
            $csv = Import-Csv -Path (Join-Path -Path (Get-Location) -ChildPath "School_Table.csv")
            break;
        }
    }

    [Microsoft.Azure.Cosmos.Table.TableBatchOperation]$batchOperation = New-Object -TypeName Microsoft.Azure.Cosmos.Table.TableBatchOperation
    [int]$rowCount = 0;

    foreach ($row in $csv) {
        $rowCount++;
        try{
            $entity = $null;

            switch($table.Name) {
                'Beats' {
                    $entity =  Get-BeatEntity($row);
                    break;
                }
                'Cities' {
                    $entity =  Get-CityEntity($row);
                    break;
                }
                'Statutes' {
                    $entity =  Get-StatuteEntity($row);
                    break;
                }
                'Schools' {
                    $entity =  Get-SchoolEntity($row);
                    break;
                }
            }        
        
            if ($rowCount -le 100) {
                $batchOperation.InsertOrReplace($entity);
            }
            else {
                $null = $table.CloudTable.ExecuteBatch($batchOperation, $null, $null)
	            [Microsoft.Azure.Cosmos.Table.TableBatchOperation]$batchOperation = New-Object -TypeName Microsoft.Azure.Cosmos.Table.TableBatchOperation
	            $batchOperation.InsertOrReplace($entity) 
	            $rowCount = 1
            }
        }
        catch {
            if ($_.Exception.Message -eq 'Exception calling "Execute" with "1" argument(s): "Conflict"') {
                $row.Value2
                continue;
            }
            else {
                $_.Exception.Message
            }
        }
    }

    if ($batchOperation.Count -ne 0) {
        $null = $table.CloudTable.ExecuteBatch($batchOperation, $null, $null)
    }
}

Write-Host "Import Script Completed..."
$stopWatch.Stop()
[Timespan] $ts = $stopWatch.Elapsed;
$elapsedTime = [String]::Format("{0:00}:{1:00}:{2:00}.{3:00}", $ts.Hours, $ts.Minutes, $ts.Seconds, $ts.Milliseconds / 10);
Write-Host "RunTime $elapsedTime    --> Format == Hours : Minutes : Seconds : Milliseconds"