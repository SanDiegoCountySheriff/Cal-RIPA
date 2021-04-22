

function Remove-WebAppIPRestriction {
    Param(
        [Parameter(Position = 1, Mandatory = $true, HelpMessage = "Resource group name", ValueFromPipeline = $false)] 
        $ResourceGroupName,
        [Parameter(Position = 0, Mandatory = $true, HelpMessage = "WebApp name", ValueFromPipeline = $false)] 
        $FunctionName,
        [Parameter(Position = 2, Mandatory = $true, HelpMessage = "Restricted IP address without CIDR (Example: 172.16.0.0)", ValueFromPipeline = $false)] 
        $IPAddress
    )
              
    If (!(Get-AzContext)) {
        Write-Host "Please login to your Azure account"
        Connect-AzAccount -Environment AzureUSGovernment
    }
 
    $APIVersion = ((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions[0]
    $FunctionNameConfig = (Get-AzResource -ResourceType Microsoft.Web/sites/config -Name $FunctionName -ResourceGroupName $ResourceGroupName -ApiVersion $APIVersion)
    $IpSecurityRestrictions = $FunctionNameConfig.Properties.ipsecurityrestrictions

    $cidr = "$($IPAddress)/32"
 
    if ($cidr -in $IpSecurityRestrictions.ipAddress) {
        "IP address $IPAddress exists in function $FunctionName."
 
        [System.Collections.ArrayList]$ArrayList = $IpSecurityRestrictions

        $adoIPAddress = $ArrayList | where name -eq 'AllowAdoDeployment'

        $ArrayList.Remove($adoIPAddress)
 
        $FunctionNameConfig.properties.ipSecurityRestrictions = $ArrayList
        $FunctionNameConfig | Set-AzResource  -ApiVersion $APIVersion -Force | Out-Null
        Write-Host "Removed restricted IP address $IPAddress from Function $FunctionName"
    }
    else {
        Write-Host "IP address restriction $IPAddress does not exist in $FunctionName"
    }
}

$resgrp = "sdsd-ripa-d-rg"
$apimName = "sdsd-ripa-d-apim"

$ipAddress = (Invoke-WebRequest -uri "http://ifconfig.me/ip").Content

Remove-WebAppIPRestriction -ResourceGroupName $resgrp -FunctionName sdsd-ripa-d-textanalytics-fa  -IPAddress $ipAddress

