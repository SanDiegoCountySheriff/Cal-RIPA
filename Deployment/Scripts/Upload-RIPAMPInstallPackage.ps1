param (
        $BaseFolder,
        $CSSA_STORAGE_ACCOUNT_NAME,
        $CSSA_STORAGE_ACCOUNT_KEY,
        $CSSA_MP_DEPLOYMENT_CONTAINER,
        $CSSA_CERT_KEY_VAULT_NAME,
        $CSSA_SAS_EXPIRY_YEARS,
        $CSSA_SAS_EXPIRY_MONTHS,
        $CSSA_SAS_EXPIRY_DAYS
)

Write-Host "Starting upload & SaS key processing"
Write-Host "Using base directory:" $BaseFolder

Get-ChildItem
Import-Module .\Upload-RIPAMPArtifact.psm1 -Force

Set-Location $BaseFolder

Write-Host "Processing DNS/SSL/CDN configurations"
UploadAndCreateKey -FileName new-ripa-cssa-sub-domain.sh -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts/SSL" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS

Write-Host "Processing domain data configurations"
UploadAndCreateKey -FileName Import-DomainData.ps1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName Beat_Table.csv -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName City_Table.csv -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName Offense_Table.csv -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName School_Table.csv -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/IaC/Marketplace" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS

Write-Host "Processing application publishing configurations"
UploadAndCreateKey -FileName Import-AllRIPAApplications.ps1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName Import-ApimApis.psm1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName New-FunctionHostKey.psm1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName New-RIPAApimBackend.psm1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName domain.zip -WorkingFolder "$BaseFolder/_RIPA-Domain/drop" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName stop.zip -WorkingFolder "$BaseFolder/_RIPA-Stop/drop" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName submission.zip -WorkingFolder "$BaseFolder/_RIPA-Submission/drop" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName textanalytics.zip -WorkingFolder "$BaseFolder/_RIPA-TextAnalytics/drop" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
UploadAndCreateKey -FileName userprofile.zip -WorkingFolder "$BaseFolder/_RIPA-UserProfile/drop" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS

Rename-Item -Path "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts/mp-config.json" -NewName config.json -Force
UploadAndCreateKey -FileName config.json -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS

$UiPackagePath = "$BaseFolder/_RIPA-UI/drop"
Get-ChildItem -Path $UiPackagePath | Where-Object { $_.Name -match '^[0-9]*\.zip' } | Rename-Item -NewName ui.zip
UploadAndCreateKey -FileName ui.zip -WorkingFolder $UiPackagePath -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS


Write-Host "Finished upload & SaS key processing"