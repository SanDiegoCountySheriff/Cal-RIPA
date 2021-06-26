function UploadAndCreateKey
{
    param (
        $FileName,
        $WorkingFolder
    )

    Write-Host "Processing file:" $FileName

    Set-Location $WorkingFolder
    
    $LowerCaseFileName = $FileName.ToLower()

    $expires = (Get-Date).AddYears($CSSA_SAS_EXPIRY_YEARS).AddMonths($CSSA_SAS_EXPIRY_MONTHS).AddDays($CSSA_SAS_EXPIRY_DAYS).ToString('yyyy-MM-dd')
    Write-Host "Expiry date:" $expires

    Rename-Item -Path $FileName -NewName $FileName.ToLower()

    Write-Host "Uploading API package"
    az storage blob upload --account-name $(CSSA_STORAGE_ACCOUNT_NAME) --account-key $(CSSA_STORAGE_ACCOUNT_KEY) -c "$(CSSA_MP_DEPLOYMENT_CONTAINER)" -n $LowerCaseFileName  -f $LowerCaseFileName 

    Write-Host "Requesting URL"
    $url = (az storage blob url --account-name $(CSSA_STORAGE_ACCOUNT_NAME) --account-key $(CSSA_STORAGE_ACCOUNT_KEY) -c "$(CSSA_MP_DEPLOYMENT_CONTAINER)" -n $LowerCaseFileName).ToString()

    Write-Host "Requesting SAS"
    $sas = (az storage blob generate-sas --account-name $(CSSA_STORAGE_ACCOUNT_NAME) --account-key $(CSSA_STORAGE_ACCOUNT_KEY) -c "$(CSSA_MP_DEPLOYMENT_CONTAINER)" -n $LowerCaseFileName --permissions r --expiry $expires)

    $itemSasUrl = "$($url)?$($sas)".Replace('"?"', '?')
    
    $itemSecretKey = "MP-" + $FileName.ToUpper().Replace('.', '-') + "-SAS-URL"
    Write-Host "Using secret key:" $itemSecretKey

    Write-Host "Storing key in KV:" $itemSecretKey
    az keyvault secret set --vault-name $(CSSA_CERT_KEY_VAULT_NAME) -n $itemSecretKey --value $itemSasUrl

    Write-Host "Finished processing:" $FileName
}

Write-Host "Starting upload & SaS key processing"

Write-Host "Processing DNS/SSL/CDN configurations"
UploadAndCreateKey new-ripa-cssa-sub-domain.sh "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts/SSL"

Write-Host "Processing domain data configurations"
UploadAndCreateKey Import-DomainData.ps1 "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"
UploadAndCreateKey Beat_Table.csv "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"
UploadAndCreateKey City_Table.csv "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"
UploadAndCreateKey Offense_Table.csv "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"
UploadAndCreateKey School_Table.csv "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"

Write-Host "Processing application publishing configurations"
Rename-Item -Path mp-config.json -NewName config.json
$UiPackagePath = "$(System.DefaultWorkingDirectory)/_RIPA-UI/drop"
Get-ChildItem -Path $UiPackagePath | Where-Object { $_.Name -match '^[0-9]*\.zip' } | Rename-Item -NewName ui.zip

UploadAndCreateKey Import-AllRIPAApplications.ps1 "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey Import-ApimApis.psm1 "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey New-FunctionHostKey.psm1 "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey New-RIPAApimBackend.psm1 "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey config.json "$(System.DefaultWorkingDirectory)/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey domain.zip "$(System.DefaultWorkingDirectory)/_RIPA-Domain/drop"
UploadAndCreateKey stop.zip "$(System.DefaultWorkingDirectory)/_RIPA-Stop/drop"
UploadAndCreateKey submission.zip "$(System.DefaultWorkingDirectory)/_RIPA-Submission/drop"
UploadAndCreateKey textanalytics.zip "$(System.DefaultWorkingDirectory)/_RIPA-TextAnalytics/drop"
UploadAndCreateKey userprofile.zip "$(System.DefaultWorkingDirectory)/_RIPA-UserProfile/drop"
UploadAndCreateKey ui.zip "$(System.DefaultWorkingDirectory)/_RIPA-UI/drop"

Write-Host "Finished upload & SaS key processing"