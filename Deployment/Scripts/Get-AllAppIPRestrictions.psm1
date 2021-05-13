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

Export-ModuleMember -Function Get-AllAppIPRestrictions