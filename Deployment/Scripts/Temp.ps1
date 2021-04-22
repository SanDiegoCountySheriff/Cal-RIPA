function Get-KuduApiAuthorizationHeaderValue($ResourceGroupName, $WebAppName){
 
    [Xml]$publishingCredentials = Get-AzWebAppPublishingProfile -ResourceGroupName $ResourceGroupName -Name $WebAppName -Format WebDeploy
    
    $publisherName = ($publishingCredentials.publishData.publishProfile | Select userName)[0]
    $publisherPassword = ($publishingCredentials.publishData.publishProfile | Select userPWD)[0]

    Write-Host $publisherName
    Write-Host $publisherPassword
 
    return ("Basic {0}" -f [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $publisherName, $publisherPassword))))
}
 
 
$accessToken = Get-KuduApiAuthorizationHeaderValue sdsd-ripa-d-rg sdsd-ripa-d-textanalytics-fa

Write-Host $accessToken

function Get-MasterAPIKey($kuduApiAuthorisationToken, $webAppName ){
 
    $apiUrl = "https://$webAppName.scm.azurewebsites.us/api/functions/admin/masterkey"
     
    $result = Invoke-RestMethod -Uri $apiUrl -Headers @{"Authorization"=$kuduApiAuthorisationToken;"If-Match"="*"} 
     
    return $result`
}
 
function Get-HostAPIKeys($kuduApiAuthorisationToken, $webAppName, $masterKey ){
 
    $apiUrl = "https://$webAppName.azurewebsites.us/admin/host/keys?code=$masterKey"
  
    $result = Invoke-WebRequest $apiUrl
     
    return $result`
}
 
$webAppName = "sdsd-ripa-d-textanalytics-fa"

$adminCode = Get-MasterAPIKey $accessToken $webAppname
 
Write-Host "masterKey = " $adminCode.Masterkey
 
$result = Get-HostAPIKeys $accessToken $webAppname $adminCode.Masterkey
 
$keysCode =  $result.Content | ConvertFrom-Json
 
Write-Host "default Key = " $keysCode.Keys[0].Value