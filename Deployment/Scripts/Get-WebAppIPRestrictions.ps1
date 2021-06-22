function Get-WebAppIPRestrictions {
                
    if (!(Get-AzContext)) {
        Write-Host "Please login to your Azure account"
        Connect-AzAccount -Environment AzureUsGovernment
    }

    $APIVersion = ((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions[0]
    $WebApps = Get-AzFunctionApp

    foreach ($WebApp in $WebApps) {
 
        $WebAppName = $WebApp.Name
        $WebAppRGName = $WebApp.ResourceGroup
        $WebAppConfig = (Get-AzResource -ResourceType Microsoft.Web/sites/config -ResourceGroupName $WebAppRGName -ApiVersion $APIVersion -Name $WebAppName)

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

$ResourceGroupName = 'sdsd-ripa-d-rg'
$Name = 'sdsd-ripa-d-textanalytics-fa'

Get-WebAppIPRestrictions


# '<policies><inbound><base /><set-backend-service id="apim-generated-policy" backend-id="sdsd-ripa-d-textanalytics-fa" /></inbound></policies>'

# Get-AzFunctionApp -Name $Name -ResourceGroupName $ResourceGroupName

# Get-AzFunctionAppSetting -Name $Name -ResourceGroupName $ResourceGroupName

# Uninstall-AzureRm