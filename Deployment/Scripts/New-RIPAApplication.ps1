Write-Host "Create RIPA AD Application"

$appName = "RIPA-AUTO"
$adminGroupName = "$($appName)-ADMINS-DEV"
$userGroupName = "$($appName)-USERS-DEV"

$adminGroupExists = Get-AzADGroup -DisplayName $adminGroupName
if($adminGroupExists)
{
    Write-Host "Removing existing AD Group " $adminGroupName
    Remove-AzADGroup -DisplayName $adminGroupName -Force
}

$userGroupExists = Get-AzADGroup -DisplayName $userGroupName
if($userGroupExists)
{
    Write-Host "Removing existing AD Group " $userGroupName
    Remove-AzADGroup -DisplayName $userGroupName -Force
}

$appExists = Get-AzADApplication -DisplayName $appName
if($appExists)
{
    Write-Host "Removing existing AD Application " $appName
    Remove-AzADApplication -DisplayName "RIPA-AUTO" -Force
}


Write-Host "Creating AD Group" $adminGroupName 
New-AzADGroup -DisplayName $adminGroupName -Description $adminGroupName -MailNickname $adminGroupName
Write-Host "Creating AD Group" $userGroupName 
New-AzADGroup -DisplayName $userGroupName -Description $userGroupName -MailNickname $userGroupName

Write-Host "Creating AD Application" $appName
$spaAadApplication = New-AzADApplication `
   -DisplayName $appName `
   -IdentifierUris "api://sometest" `
   -ReplyUrls "http://localhost:3000","https://localhost:3000" `
   -AvailableToOtherTenants $false 

Write-Host "Creating AD Service Principal for" $appName
$currentAppId = $spaAadApplication.ApplicationId
$spaServicePrincipal = New-AzADServicePrincipal -ApplicationId $currentAppId -Role Reader

Update-AzADApplication -ApplicationId $currentAppId -IdentifierUri "api://$($currentAppId)"

# add the user running the script as an app owner if needed
#$owner = Get-AzADApplicationOwner -ObjectId $spaAadApplication.ObjectId
#if ($owner -eq $null)
#{ 
#    Add-AzureADApplicationOwner -ObjectId $spaAadApplication.ObjectId -RefObjectId $user.ObjectId
#    Write-Host "'$($user.UserPrincipalName)' added as an application owner to app '$($spaServicePrincipal.DisplayName)'"
#} 

$finalApp = Get-AzADApplication -DisplayName $appName
$finalApp

Get-AzADServicePrincipal -DisplayNameBeginsWith "RIPA" # > ".\sps.txt"