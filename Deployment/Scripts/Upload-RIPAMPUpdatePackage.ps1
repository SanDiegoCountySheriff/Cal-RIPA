Param (
        $BaseFolder,
        $FileVersion = $null,
        $CSSA_STORAGE_ACCOUNT_NAME,
        $CSSA_STORAGE_ACCOUNT_KEY,
        $CSSA_MP_DEPLOYMENT_CONTAINER,
        $CSSA_CERT_KEY_VAULT_NAME,
        $CSSA_SAS_EXPIRY_YEARS,
        $CSSA_SAS_EXPIRY_MONTHS,
        $CSSA_SAS_EXPIRY_DAYS
)

Import-Module .\Upload-RIPAMPArtifact -Force

Write-Host "Starting upload & SaS key processing"
Write-Host "Using base directory:" $BaseFolder

Write-Host "Processing application publishing configurations"
Upload-RIPAMPArtifact -FileName Import-AllRIPAApplications.ps1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
Upload-RIPAMPArtifact -FileName Import-ApimApis.psm1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
Upload-RIPAMPArtifact -FileName New-FunctionHostKey.psm1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
Upload-RIPAMPArtifact -FileName New-RIPAApimBackend.psm1 -WorkingFolder "$BaseFolder/_SanDiegoCountySheriff_Cal-RIPA/Deployment/Scripts" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
Upload-RIPAMPArtifact -FileName domain.zip -WorkingFolder "$BaseFolder/_RIPA-Domain/drop" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
Upload-RIPAMPArtifact -FileName stop.zip -WorkingFolder "$BaseFolder/_RIPA-Stop/drop" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
Upload-RIPAMPArtifact -FileName submission.zip -WorkingFolder "$BaseFolder/_RIPA-Submission/drop" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
Upload-RIPAMPArtifact -FileName textanalytics.zip -WorkingFolder "$BaseFolder/_RIPA-TextAnalytics/drop" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS
Upload-RIPAMPArtifact -FileName userprofile.zip -WorkingFolder "$BaseFolder/_RIPA-UserProfile/drop" -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS

Write-Host "Processing UI package"
$UiPackagePath = "$BaseFolder/_RIPA-UI/drop"
Get-ChildItem -Path $UiPackagePath | Where-Object { $_.Name -match '^[0-9]*\.zip' } | Rename-Item -NewName ui.zip
Upload-RIPAMPArtifact -FileName ui.zip -WorkingFolder $UiPackagePath -FileVersion $FileVersion -StorageAccountName $CSSA_STORAGE_ACCOUNT_NAME -StorageAccountKey $CSSA_STORAGE_ACCOUNT_KEY -StorageAccountContainer $CSSA_MP_DEPLOYMENT_CONTAINER -KeyVaultName $CSSA_CERT_KEY_VAULT_NAME -ExpiryYears $CSSA_SAS_EXPIRY_YEARS -ExpiryMonths $CSSA_SAS_EXPIRY_MONTHS -ExpiryDays $CSSA_SAS_EXPIRY_DAYS

Write-Host "Finished upload & SaS key processing"