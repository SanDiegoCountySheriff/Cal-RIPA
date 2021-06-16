$path = ''
$filename = 'sdcs-look-up-table-2021.xlsx'
$rg = 'rgTableEntities'
$storageAccountName = 'storagelwptest'

#region functions
function Get-BeatEntity {
    param (
        $row
    )

    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = ($row.Value2[1,1]);
    $entity.Properties.Add("Id",([int]$row.Value2[1,1]));
    $entity.Properties.Add("Community",($row.Value2[1,2]));
    $entity.Properties.Add("Command",($row.Value2[1,3]));
        
    if(![string]::IsNullOrWhiteSpace(($row.Value2[1,4]))) {
        $entity.Properties.Add("CommandAuditGroup",($row.Value2[1,4]));
    }
    if(![string]::IsNullOrWhiteSpace(($row.Value2[1,5]))) {
        $entity.Properties.Add("CommandAuditSize",($row.Value2[1,5]));
    }

    return $entity;
}

function Get-CityEntity {
    param (
        $row
    )

    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.Value2[1,2];
    $entity.Properties.Add("State",($row.Value2[1,1]));
    $entity.Properties.Add("Name",($row.Value2[1,2]));
    $entity.Properties.Add("County",($row.Value2[1,3]));

    if(![string]::IsNullOrWhiteSpace(($row.Value2[1,4]))) {
        $entity.Properties.Add("DeactivationDate",[DateTime]::FromOADate(($row.Value2[1,4])))
    }

    return $entity;
}

function Get-StatuteEntity {
    param (
        $row
    )

    $entity =  New-Object -TypeName Microsoft.Azure.Cosmos.Table.DynamicTableEntity;
    $entity.PartitionKey = "CA";
    $entity.RowKey = $row.Value2[1,2];
    $entity.Properties.Add("OffenseValidationCD",($row.Value2[1,1]));
    $entity.Properties.Add("OffenseCode",($row.Value2[1,2]));
    $entity.Properties.Add("OffenseTxnTypeCD",($row.Value2[1,3]));
    $entity.Properties.Add("OffenseStatute",($row.Value2[1,4]));
    $entity.Properties.Add("StatuteLiteral",($row.Value2[1,6]));
    $entity.Properties.Add("OffenseTypeOfCharge",($row.Value2[1,8]));
    $entity.Properties.Add("ALPSCognizantCD",($row.Value2[1,14]));
    

    if (![string]::IsNullOrWhiteSpace(($row.Value2[1,5]))) {
        $entity.Properties.Add("OffenseLiteralIdentifierCD",($row.Value2[1,5]));
    }

    if (![string]::IsNullOrWhiteSpace(($row.Value2[1,7]))) {
        $entity.Properties.Add("OffenseDefaultTypeOfCharge",($row.Value2[1,7]));
    }

    if (![string]::IsNullOrWhiteSpace(($row.Value2[1,10]))) {
        $entity.Properties.Add("OffenseDegree",([int]$row.Value2[1,10]));
    }

    if (![string]::IsNullOrWhiteSpace(($row.Value2[1,11]))) {
        $entity.Properties.Add("BCSHierarchyCD", ([int]$row.Value2[1,11]));
    }

    if (![string]::IsNullOrWhiteSpace(($row.Value2[1,12]))) {
        if (($row.Value2[1,12]).Length -eq 10) {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::ParseExact(($row.Value2[1,12]),"yyyy-MM-dd", [CultureInfo]::InvariantCulture));
        }
        elseif (($row.Value2[1,12]).ToString().Length -eq 8) {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::ParseExact(($row.Value2[1,12]),"yyyyMMdd", [CultureInfo]::InvariantCulture));
        }
        else {
            $entity.Properties.Add("OffenseEnacted", [DateTime]::FromOADate(($row.Value2[1,12])));
        }
    }

    if (![string]::IsNullOrWhiteSpace(($row.Value2[1,13]))) {
        if (($row.Value2[1,13]).Length -eq 10) {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::ParseExact(($row.Value2[1,13]),"yyyy-MM-dd", [CultureInfo]::InvariantCulture));
        }
        elseif (($row.Value2[1,13]).ToString().Length -eq 8) {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::ParseExact(($row.Value2[1,13]),"yyyyMMdd", [CultureInfo]::InvariantCulture));
        }
        else {
            $entity.Properties.Add("OffenseRepealed", [DateTime]::FromOADate(($row.Value2[1,13])));
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
    $entity.RowKey = $row.Value2[1,1];
    $entity.Properties.Add("CDSCode",($row.Value2[1,1]));
    $entity.Properties.Add("Status",($row.Value2[1,2]));
    $entity.Properties.Add("County",($row.Value2[1,3]));
    $entity.Properties.Add("District",($row.Value2[1,4]));
    $entity.Properties.Add("Name",($row.Value2[1,5]));

    return $entity;
}

#endregion

Install-Module AzTable -Force
Install-Module Az.Storage -Force
Import-Module AzTable -Force
Import-module Az.Storage -Force
Add-AzAccount #Interactive login

$ctx = (Get-AzStorageAccount -ResourceGroupName $rg -Name $storageAccountName).Context

$excel = New-Object -Com Excel.Application
$wb = $excel.Workbooks.Open($path + '\' + $filename)

$tableNames = @('Beats','Cities','Statutes','Schools')


foreach ($tableName in $tableNames){
    #Cloud Table 
    if($null -eq (Get-AzStorageTable –Context $ctx | Where-Object { $_.Name -eq $tableName })) {
        New-AzStorageTable –Name $tableName –Context $ctx
    }
    $table = Get-AzStorageTable –Name $tableName –Context $ctx;
    switch ($tableName) {
        'Beats' {
            $workSheet = $wb.Sheets["Beat_Table"];
            break;
        }
        'Cities' {
            $workSheet = $wb.Sheets["City_Table"];
            break;
        }
        'Statutes' {
            $workSheet = $wb.Sheets["Offense_Table"];
            break;
        }
        'Schools' {
            $workSheet = $wb.Sheets["School_Table"];
            break;
        }
    }

    [Microsoft.Azure.Cosmos.Table.TableBatchOperation]$batchOperation = New-Object -TypeName Microsoft.Azure.Cosmos.Table.TableBatchOperation
    [int]$rowCount = 0;

    foreach ($row in $workSheet.UsedRange.Rows | Select-Object -skip 1 ) {
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
                $result = $table.CloudTable.ExecuteBatch($batchOperation, $null, $null)
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
        $result = $table.CloudTable.ExecuteBatch($batchOperation, $null, $null)
    }
}
$excel.Workbooks.Close()