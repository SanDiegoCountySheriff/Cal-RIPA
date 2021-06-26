
param (
    $BaseFolder,
    $CSSA_STORAGE_ACCOUNT_NAME,
    $CSSA_STORAGE_ACCOUNT_KEY,
    $CSSA_MP_DEPLOYMENT_CONTAINER,
    $CSSA_CERT_KEY_VAULT_NAME
)


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
    az storage blob upload --account-name $CSSA_STORAGE_ACCOUNT_NAME --account-key $CSSA_STORAGE_ACCOUNT_KEY -c $CSSA_MP_DEPLOYMENT_CONTAINER -n $LowerCaseFileName  -f $LowerCaseFileName 

    Write-Host "Requesting URL"
    $url = (az storage blob url --account-name $CSSA_STORAGE_ACCOUNT_NAME --account-key $CSSA_STORAGE_ACCOUNT_KEY -c $CSSA_MP_DEPLOYMENT_CONTAINER -n $LowerCaseFileName).ToString()

    Write-Host "Requesting SAS"
    $sas = (az storage blob generate-sas --account-name $CSSA_STORAGE_ACCOUNT_NAME --account-key $CSSA_STORAGE_ACCOUNT_KEY -c $CSSA_MP_DEPLOYMENT_CONTAINER -n $LowerCaseFileName --permissions r --expiry $expires)

    $itemSasUrl = "$($url)?$($sas)".Replace('"?"', '?')
    
    $itemSecretKey = "MP-" + $FileName.ToUpper().Replace('.', '-') + "-SAS-URL"
    Write-Host "Using secret key:" $itemSecretKey

    Write-Host "Storing key in KV:" $itemSecretKey
    az keyvault secret set --vault-name $CSSA_CERT_KEY_VAULT_NAME -n $itemSecretKey --value $itemSasUrl

    Write-Host "Finished processing:" $FileName
}

Write-Host "Starting upload & SaS key processing"
Write-Host "Using base directory:" $BaseFolder

Write-Host "Processing DNS/SSL/CDN configurations"
UploadAndCreateKey new-ripa-cssa-sub-domain.sh "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts/SSL"

Write-Host "Processing domain data configurations"
UploadAndCreateKey Import-DomainData.ps1 "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"
UploadAndCreateKey Beat_Table.csv "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"
UploadAndCreateKey City_Table.csv "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"
UploadAndCreateKey Offense_Table.csv "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"
UploadAndCreateKey School_Table.csv "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace"

Write-Host "Processing application publishing configurations"
Rename-Item -Path mp-config.json -NewName config.json
$UiPackagePath = "$BaseFolder/_RIPA-UI/drop"
Get-ChildItem -Path $UiPackagePath | Where-Object { $_.Name -match '^[0-9]*\.zip' } | Rename-Item -NewName ui.zip

UploadAndCreateKey Import-AllRIPAApplications.ps1 "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey Import-ApimApis.psm1 "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey New-FunctionHostKey.psm1 "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey New-RIPAApimBackend.psm1 "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey config.json "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts"
UploadAndCreateKey domain.zip "$BaseFolder/_RIPA-Domain/drop"
UploadAndCreateKey stop.zip "$BaseFolder/_RIPA-Stop/drop"
UploadAndCreateKey submission.zip "$BaseFolder/_RIPA-Submission/drop"
UploadAndCreateKey textanalytics.zip "$BaseFolder/_RIPA-TextAnalytics/drop"
UploadAndCreateKey userprofile.zip "$BaseFolder/_RIPA-UserProfile/drop"

UploadAndCreateKey ui.zip $UiPackagePath

Write-Host "Finished upload & SaS key processing"