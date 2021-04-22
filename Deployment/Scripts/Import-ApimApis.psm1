Import-Module Az.ApiManagement -Force
Import-Module az.AzResource -Force

function Get-AllAppIPRestrictions {
                
    $APIVersion = ((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions[0]
    $WebApps = Get-AzFunctionApp

    foreach ($webApp in $WebApps) {
 
        $WebAppName = $WebApp.Name
        $WebAppRGName = $WEbApp.ResourceGroup
        $WebAppConfig = (Get-AzResource -ResourceType Microsoft.Web/sites/config -Name $WebAppName -ResourceGroupName $WebAppRGName -ApiVersion $APIVersion)
        $IpSecurityRestrictions = $WebAppConfig.Properties.ipsecurityrestrictions | ConvertTo-Json
        if ($IpSecurityRestrictions -eq $null) {
            Write-Host "No IP restrictions found for WebApp $WebAppName ."
             
        }
        else {
            Write-Host "IP restrictions set for WebApp $WebAppName : "
            $IpSecurityRestrictions
             
        }
    }
}

function Set-AppIPRestriction {
    Param(
        [Parameter(Mandatory = $true, HelpMessage = "Resource group name")] 
        $ResourceGroupName,
        [Parameter(Mandatory = $true, HelpMessage = "FunctionApp name")] 
        $FunctionName,
        [Parameter(Mandatory = $true, HelpMessage = "Restricted IP address without CIDR (Example: 172.16.0.0)")] 
        $IPAddress,
        [Parameter(Mandatory = $true, HelpMessage = "IP Restriction rule name")] 
        $RuleName,
        [Parameter(Mandatory = $true, HelpMessage = "IP Restriction rule action (Allow/Deny)")] 
        $RuleAction,
        [Parameter(Mandatory = $true, HelpMessage = "IP Restriction rule priority (1-999)")] 
        $RulePriority,
        [Parameter(Mandatory = $false, HelpMessage = "IP Restriction rule description")] 
        $RuleDescription = "Temporary IP restriction for ADO CI/CD"
    )
 
    $APIVersion = ((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions[0]
    $FunctionNameConfig = (Get-AzResource -ResourceType Microsoft.Web/sites/config -Name $FunctionName -ResourceGroupName $ResourceGroupName -ApiVersion $APIVersion)
    $IpSecurityRestrictions = $FunctionNameConfig.Properties.ipsecurityrestrictions
 
    $cidr = "$($IPAddress)/32"
    
    if ($cidr -in $IpSecurityRestrictions.ipAddress) {
        "IP address $IPAddress is already added as restricted to $FunctionName."         
    }
    else {
        $webIP = [PSCustomObject]@{name = ''; ipAddress = ''; Action = ''; Priority = ''; description = ''}
        $webIP.ipAddress = $cidr
        $webIP.name = $RuleName
        $webIP.action = $RuleAction
        $webIP.priority = $RulePriority
        $webIP.description = $RuleDescription

        if($IpSecurityRestrictions -eq $null){
            $IpSecurityRestrictions = @()
        }
 
        [System.Collections.ArrayList]$ArrayList = $IpSecurityRestrictions
        $ArrayList.Add($webIP) | Out-Null
 
        $FunctionNameConfig.properties.ipSecurityRestrictions = $ArrayList
        $FunctionNameConfig | Set-AzResource  -ApiVersion $APIVersion -Force | Out-Null
        Write-Host "New restricted IP address $IPAddress has been added to WebApp $FunctionName"
    }
}

function Remove-AppIPRestriction {
    Param(
        [Parameter(Mandatory = $true, HelpMessage = "Resource group name")] 
        $ResourceGroupName,
        [Parameter(Mandatory = $true, HelpMessage = "FunctionApp name")] 
        $FunctionName,
        [Parameter(Mandatory = $true, HelpMessage = "Restricted IP address without CIDR (Example: 172.16.0.0)")] 
        $IPAddress
    )
              
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

function Import-FunctionApi()
{
	param (
        [Parameter(Mandatory = $true, HelpMessage = "Resource environment (d,q,p, etc.)")] 
        $Environment, 
        [Parameter(Mandatory = $true, HelpMessage = "Azure resource group")] 
		$ResourceGroupName, 
        [Parameter(Mandatory = $true, HelpMessage = "Azure API Management instance name")] 
		$ServiceName, 
        [Parameter(Mandatory = $true, HelpMessage = "functional name of the api (domain, stop, textanalytic, etc.)")] 
		$ApiTag
	)

	Write-Host "Starting ${apiTag} import"

    $ApimCntx = New-AzApiManagementContext -ResourceGroupName $ResourceGroupName -ServiceName $ServiceName

    Write-Host "Getting function key code"
    $functionCode = ((az functionapp function keys list -g sdsd-ripa-d-rg -n sdsd-ripa-d-textanalytics-fa --function-name RenderOpenApiDocument) | ConvertFrom-Json | Select default).default
	
    $serviceUrl = "https://sdsd-ripa-d-$($ApiTag)-fa.azurewebsites.us/api"
	$swaggerUrl = "$($serviceUrl)/openapi/v3.0?code=$($functionCode)"

    Write-Host "Getting local IP Address"
    $ipAddress = (Invoke-WebRequest -uri "http://ifconfig.me/ip").Content
    
    Write-Host "Setting access restriction for local IP Address"
    Set-AppIPRestriction -ResourceGroupName $ResourceGroupName -FunctionName sdsd-ripa-d-textanalytics-fa  -IPAddress $ipAddress -RuleName "AllowAdoDeployment" -RuleAction "Allow" -RulePriority "900"

	Write-Host "Updating ${serviceUrl}"
	Write-Host "With ${swaggerUrl}"

	# import the latest swagger
	Write-Host "Importing api $ApiTag from $swaggerUrl"
	Import-AzApiManagementApi -Context $ApimCntx -SpecificationFormat "OpenApi" -SpecificationUrl $swaggerUrl -Path $ApiTag -ApiId $ApiTag
	
	Write-Host "Setting api backend to point to $ApiTag function"
    Set-AzApiManagementPolicy -Context $ApimCntx -ApiId $ApiTag -Policy '<policies><inbound><base /><set-backend-service id="apim-generated-policy" backend-id="sdsd-ripa-d-textanalytics-fa" /></inbound></policies>' 

	# reset the protocol (import modifies this for some reason)
	Write-Host "Updating protocol for $($api.Name) at $serviceUrl"
	Set-AzApiManagementApi -Context $ApimCntx -ApiId $ApiTag -Protocols @('https') -Name $ApiTag -ServiceUrl $serviceUrl

    Write-Host "removing access restriction for local IP Address"
    Remove-AppIPRestriction -ResourceGroupName $ResourceGroupName -FunctionName sdsd-ripa-d-textanalytics-fa  -IPAddress $ipAddress
}

#$resgrp = "sdsd-ripa-d-rg"

#$ipAddress = (Invoke-WebRequest -uri "http://ifconfig.me/ip").Content
#Set-AppIPRestriction -ResourceGroupName $resgrp -FunctionName sdsd-ripa-d-textanalytics-fa  -IPAddress $ipAddress -RuleName "AllowAdoDeployment" -RuleAction "Allow" -RulePriority "900"
#Remove-AppIPRestriction -ResourceGroupName $resgrp -FunctionName sdsd-ripa-d-textanalytics-fa  -IPAddress $ipAddress 


# load an apim context
#Write-Host "Loading APIM $apimName"
#$ctx = New-AzApiManagementContext -ResourceGroupName $resgrp -ServiceName $apimName

# loop through the apis and import the latest defs
#Write-Host "Updating all services..."
#foreach ($ApiTag in $ApiTags)
#{
#	ImportApi -apiTag $ApiTag -apimCtx $ctx -servicesUri $OpenApiServicesUri
#}
#Write-Host "Services Updated"


#Import-FunctionApi -Environment d -ResourceGroupName $resgrp -ServiceName sdsd-ripa-d-apim -ApiTag textanalytics

Export-ModuleMember -Function Get-InstalledAzModule
Export-ModuleMember -Function Get-AllAppIPRestrictions
Export-ModuleMember -Function Set-WebAppIPRestriction
Export-ModuleMember -Function Remove-AppIPRestriction
Export-ModuleMember -Function Import-FunctionApi