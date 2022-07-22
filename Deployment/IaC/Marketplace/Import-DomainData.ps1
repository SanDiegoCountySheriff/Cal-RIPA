Write-Host "Installing Az v6.6.0 due to Az.Account version in image"
Install-Module Az -Repository PSGallery -RequiredVersion 6.6.0 -AllowClobber -Force

Write-Host "Importing Az"
Import-Module Az -Force

Write-Host "Logging into Azure"
[string]$userName = $env:CSSA_SP_APP_ID
[string]$userPassword = $env:CSSA_SP_SECRET
[securestring]$secStringPassword = ConvertTo-SecureString $userPassword -AsPlainText -Force
[pscredential]$credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword)
Connect-AzAccount -Environment AzureUsGovernment -Tenant $env:CSSA_TENANT_ID -Subscription $env:APP_SUBSCRIPTION_ID -ServicePrincipal -Credential $credObject

Write-Host "Checking login context"
Get-AzContext

Write-Host "Getting storage account context"
$ctx = (Get-AzStorageAccount -ResourceGroupName $env:RESOURCE_GROUP_NAME -Name $env:STORAGE_ACCOUNT_NAME).Context

function Get-CityEntity {
    param ($row)

    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.Columns.Item(2).Text;
    $entity.Properties.Add("State",$row.Columns.Item(1).Text);
    $entity.Properties.Add("Name",$row.Columns.Item(2).Text);
    $entity.Properties.Add("County",$row.Columns.Item(3).Text);

    if(![string]::IsNullOrWhiteSpace($row.Columns.Item(4).Text)) {
        $entity.Properties.Add("DeactivationDate",[DateTime]::Parse($row.Columns.Item(4).Text))
    }

    return $entity;
}

function Get-StatuteEntity {
    param ($row)
    
    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.Columns.Item(2).Text;
    $entity.Properties.Add("OffenseValidationCD",$row.Columns.Item(1).Text);
    $entity.Properties.Add("OffenseCode",$row.Columns.Item(2).Text);
    $entity.Properties.Add("OffenseTxnTypeCD",$row.Columns.Item(3).Text);
    $entity.Properties.Add("OffenseStatute",$row.Columns.Item(4).Text);
    $entity.Properties.Add("OffenseTypeOfStatuteCD",$row.Columns.Item(5).Text);
    $entity.Properties.Add("StatuteLiteral",$row.Columns.Item(6).Text);
    $entity.Properties.Add("OffenseTypeOfCharge",$row.Columns.Item(8).Text);
    $entity.Properties.Add("ALPSCognizantCD",$row.Columns.Item(14).Text);
    
    if (![string]::IsNullOrWhiteSpace($row.Columns.Item(9).Text)) {
        $entity.Properties.Add("OffenseLiteralIdentifierCD",$row.Columns.Item(9).Text);
    }

    if (![string]::IsNullOrWhiteSpace($row.Columns.Item(7).Text)) {
        $entity.Properties.Add("OffenseDefaultTypeOfCharge",$row.Columns.Item(7).Text);
    }

    if (![string]::IsNullOrWhiteSpace($row.Columns.Item(10).Text)) {
        $entity.Properties.Add("OffenseDegree",[int]$row.Columns.Item(10).Text);
    }

    if (![string]::IsNullOrWhiteSpace($row.Columns.Item(11).Text)) {
        $entity.Properties.Add("BCSHierarchyCD", [int]$row.Columns.Item(11).Text);
    }

    if (![string]::IsNullOrWhiteSpace($row.Columns.Item(12).Text)) {
        if ($row.Columns.Item(12).Text.Length -eq 10) {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::ParseExact($row.Columns.Item(12).Text, "yyyy-MM-dd", [CultureInfo]::InvariantCulture));
        }
        elseif ($row.Columns.Item(12).Text.ToString().Length -eq 8) {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::ParseExact($row.Columns.Item(12).Text,"yyyyMMdd", [CultureInfo]::InvariantCulture));
        }
        else {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::FromOADate($row.Columns.Item(12).Text));
        }
    }

    if (![string]::IsNullOrWhiteSpace($row.Columns.Item(13).Text)) {
        if ($row.Columns.Item(13).Text.Length -eq 10) {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::ParseExact($row.Columns.Item(13).Text,"yyyy-MM-dd", [CultureInfo]::InvariantCulture));
        }
        elseif ($row.Columns.Item(13).Text.ToString().Length -eq 8) {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::ParseExact($row.Columns.Item(13).Text,"yyyyMMdd", [CultureInfo]::InvariantCulture));
        }
        else {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::FromOADate($row.Columns.Item(13).Text));
        }
    }

    return $entity;
}

function Get-SchoolEntity {
    param ($row)

    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.Columns.Item(1).Text;
    $entity.Properties.Add("CDSCode",$row.Columns.Item(1).Text);
    $entity.Properties.Add("Status",$row.Columns.Item(4).Text);
    $entity.Properties.Add("County",$row.Columns.Item(5).Text);
    $entity.Properties.Add("District",$row.Columns.Item(6).Text);
    $entity.Properties.Add("Name",$row.Columns.Item(7).Text);

    return $entity;
}

$tableNames = @('Cities','Schools','Statutes')
$stopWatch = [system.diagnostics.stopwatch]::StartNew()

$excel = New-Object -Com Excel.Application
$wb = $excel.Workbooks.Open("$PSScriptRoot\$env:TEMPLATE_VERSION_FORMATTED-sdcs-look-up-table-2022.xlsx")

if ($env:ENABLE_BEATS -eq "true") {
    Write-Host "Creating Beats Table"
    if($null -eq (Get-AzStorageTable -Context $ctx | Where-Object { $_.Name -eq "Beats"})) {
        $null = New-AzStorageTable -Name "Beats" -Context $ctx
    }
}

foreach ($tableName in $tableNames) {
    Write-Host "Importing $tableName..." 
    if($null -eq (Get-AzStorageTable -Context $ctx | Where-Object { $_.Name -eq $tableName })) {
        $null = New-AzStorageTable -Name $tableName -Context $ctx
    }

    $table = Get-AzStorageTable -Name $tableName -Context $ctx;

    switch ($tableName) {
        'Cities' {
            $workSheet = $wb.Sheets.Item(2)
            break;
        }
        'Schools' {
            $workSheet = $wb.Sheets.Item(3)            
            break;
        }
        'Statutes' {
            $workSheet = $wb.Sheets.Item(4)            
            break;
        }
    }
    $workSheetMaxRow = ($workSheet.UsedRange.Rows).Count

    [Microsoft.Azure.Cosmos.Table.TableBatchOperation]$batchOperation = New-Object -TypeName Microsoft.Azure.Cosmos.Table.TableBatchOperation
    [int]$rowCount = 0;

    for ($i = 2; $i -le $workSheetMaxRow; $i++) {
        $rowCount++;

        try {
            $entity = $null;

            switch($table.Name) {
                'Cities' {
                    $entity =  Get-CityEntity($workSheet.Rows.Item(1));
                    break;
                }
                'Statutes' {
                    $entity =  Get-StatuteEntity($workSheet.Rows.Item(1));
                    break;
                }
                'Schools' {
                    $entity =  Get-SchoolEntity($workSheet.Rows.Item(1));
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
}

Write-Host "Import Script Completed..."
$stopWatch.Stop()
[Timespan] $ts = $stopWatch.Elapsed;
$elapsedTime = [String]::Format("{0:00}:{1:00}:{2:00}.{3:00}", $ts.Hours, $ts.Minutes, $ts.Seconds, $ts.Milliseconds / 10);
Write-Host "RunTime $elapsedTime    --> Format == Hours : Minutes : Seconds : Milliseconds"
