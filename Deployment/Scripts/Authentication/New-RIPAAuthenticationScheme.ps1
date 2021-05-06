Import-Module .\New-RIPAAADGroup.psm1 -Force
Import-Module .\New-RIPAAppRegistration.psm1 -Force
Import-Module .\New-RIPARBACRoleAssignment.psm1 -Force

$waitTime = 30

Write-Host "Creating App Registration & Service PRincpal"
$ripaAppRegistration = New-RIPAAppRegistration `
    -DisplayName "RIPA-AUTH-APP-DEV" `
    -Description "The App Registration that provides login and authorization to RIPA application users." `
    -ReplyUri "http://localhost:4000" `
    | ConvertFrom-Json

Write-Host "Create AAD Groups"
$adminGroupId = New-RIPAAADGroup -GroupName "RIPA-ADMINS-DEV" -Description "Some test admin group"
$userGroupId = New-RIPAAADGroup -GroupName "RIPA-USERS-DEV" -Description "Some test admin group"

Write-Host "Waiting $waitTime seconds for AAD Groups propogate..."
Start-Sleep -Seconds $waitTime

Write-Host "Creating Role Assignments"
New-RIPARBACRoleAssignment -EnterpriseAppObjectId $ripaAppRegistration.ServicePrincipalId -ADGroupId $adminGroupId -AppRoleId "624d1ecc-933a-4d68-8b4c-b9a8ce343824"
New-RIPARBACRoleAssignment -EnterpriseAppObjectId $ripaAppRegistration.ServicePrincipalId -ADGroupId $userGroupId -AppRoleId "bd1f63c5-7525-4db1-bd97-09def6c07edf"

Write-Host "Finished creating App Registration & Service PRincpal"