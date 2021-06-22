Function Remove-AdoIPRestrictions
{
    Param(
        [Parameter(Mandatory = $true, HelpMessage = "Resource group name")] 
        $ResourceGroupName,
        [Parameter(Mandatory = $true, HelpMessage = "FunctionApp name")] 
        $FunctionName
    )

    Write-Host "Remove-AdoIPRestrictions starting:" $FunctionName 

    $APIVersion = ((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions[0]
    $FunctionNameConfig = (Get-AzResource -ResourceType Microsoft.Web/sites/config -Name $FunctionName -ResourceGroupName $ResourceGroupName -ApiVersion $APIVersion)
    $IpSecurityRestrictions = $FunctionNameConfig.Properties.ipsecurityrestrictions

    [System.Collections.ArrayList]$baseIpRestrictions = @()

    # Find any restriction that is NOT for ADO deployments
    foreach($ip in $IpSecurityRestrictions)
    {
        Write-Host $ip.name

        if($ip.name -ne 'AllowAdoDeployment')
        {
            $baseIpRestrictions.Add($ip)
        }
    }

    # Reset to base IPAddress restrictions
    $FunctionNameConfig.properties.ipSecurityRestrictions = $baseIpRestrictions
    $FunctionNameConfig | Set-AzResource -ApiVersion $APIVersion -Force | Out-Null

    Write-Host "Removed restricted IP address $IPAddress from Function $FunctionName"
    
    Write-Host "Remove-AdoIPRestrictions finished:" $FunctionName
}

Export-ModuleMember -Function Remove-AdoIPRestrictions