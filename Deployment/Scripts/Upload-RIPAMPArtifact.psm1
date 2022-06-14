
function Upload-RIPAMPArtifact
{
    param (
        $FileName,
        $FileVersion,
        $WorkingFolder,    
        $StorageAccountName,
        $StorageAccountKey,
        $StorageAccountContainer,
        $KeyVaultName,
        $ExpiryYears,
        $ExpiryMonths,
        $ExpiryDays
    )

    Write-Host "**************************************************************************************"
    Write-Host "Processing file:" $FileName
    
    Set-Location $WorkingFolder

    if($null -eq $FileVersion -OR $FileVersion -eq "")
    {
        $LowerCaseFileName = $FileName.ToLower()
    }
    else
    {
        $LowerCaseFileName = $FileVersion.Replace('.', '-') + "-" + $FileName.ToLower()
    }
    
    Write-Host "Using file name:" $LowerCaseFileName

    $expires = (Get-Date).AddYears($ExpiryYears).AddMonths($ExpiryMonths).AddDays($ExpiryDays).ToString('yyyy-MM-dd') + "T00:00:00Z"
    Write-Host "Expiry date:" $expires

    Rename-Item -Path $FileName -NewName $LowerCaseFileName

    Write-Host "Uploading API package:" $LowerCaseFileName
    az storage blob upload --overwrite true --timeout 300 --account-name $StorageAccountName --account-key $StorageAccountKey -c $StorageAccountContainer -n $LowerCaseFileName -f $LowerCaseFileName 

    Write-Host "Requesting URL:" $LowerCaseFileName
    $url = (az storage blob url --account-name $StorageAccountName --account-key $StorageAccountKey -c $StorageAccountContainer -n $LowerCaseFileName).ToString()

    Write-Host "Requesting SAS:" $LowerCaseFileName
    $sas = (az storage blob generate-sas --account-name $StorageAccountName --account-key $StorageAccountKey -c $StorageAccountContainer -n $LowerCaseFileName --permissions r --expiry $expires)

    $itemSasUrl = "$($url)?$($sas)".Replace('"?"', '?')
    
    $itemSecretKey = $LowerCaseFileName.ToUpper().Replace('.', '-').Replace('_', '-') + "-SAS-URL"
    Write-Host "Using secret key:" $itemSecretKey

    Write-Host "Storing key in KV:" $itemSecretKey
    $secret = (az keyvault secret set --vault-name $KeyVaultName -n $itemSecretKey --value $itemSasUrl -o tsv).id
    Write-Host "Created secret:" $secret

    Write-Host "Finished processing:" $FileName
    Write-Host ""
    Write-Host ""
}

Export-ModuleMember Upload-RIPAMPArtifact