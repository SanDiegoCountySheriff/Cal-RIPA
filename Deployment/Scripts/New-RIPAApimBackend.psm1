Function New-RIPAApimBackend
{
    Param(
        [Parameter(Mandatory = $true, HelpMessage = "Resource group name")] 
        $ResourceGroupName, 
        [Parameter(Mandatory = $true, HelpMessage = "Azure API Management instance name")] 
		$ServiceName, 
        [Parameter(Mandatory = $true, HelpMessage = "FunctionApp name")] 
        $FunctionName
    )

    # Example: New-RIPAApimBackend -ResourceGroupName "sdsd-ripa-q-rg" -ServiceName "sdsd-ripa-q-apim" -FunctionName "sdsd-ripa-q-domain-fa"

    Write-Host "New-RIPAApimBackend starting:" $FunctionName

    $oldErrorActionPreference = $ErrorActionPreference 
    $ErrorActionPreference = "Stop"

    $apimContext = New-AzApiManagementContext -ResourceGroupName $ResourceGroupName -ServiceName $ServiceName
    Write-Host "Created context"

    $functionResourceId = (Get-AzResource -ResourceGroupName $ResourceGroupName -Name $FunctionName).ResourceId
    Write-Host "Got function ResourceId"

    $functionNvPairName = $FunctionName + "-key"

    Write-Host "******************************** Ingnore any onscreen error for this command ******************************** "
    $ErrorActionPreference = "Continue"
    $functionNvPair = Get-AzApiManagementNamedValue -Context $apimContext -NamedValueId $functionNvPairName 
    $ErrorActionPreference = "Stop"

    if(!$functionNvPair)
    {
        Write-Host "Creating named/value pair: " $functionNvPairName
        $apimHostKeyName = "apim-" + $ServiceName
        $existingFunctionKeys = (Get-AzResource -Name $FunctionName | Invoke-AzResourceAction -Action host/default/listkeys -Force).functionKeys
        if(!$existingFunctionKeys.$apimHostKeyName)
        {
            Write-Host "Creating new APIM host key for:" $FunctionName

            Get-ChildItem -Filter "*New-FunctionHostKey.psm1" | Rename-Item -NewName "New-FunctionHostKey.psm1"
            Import-Module .\New-FunctionHostKey.psm1
            $newFunctionHostKey = New-FunctionHostKey -ResourceId $functionResourceId -KeyName "apim-$($ServiceName)"
        }

        Write-Host "Creating named value"
        New-AzApiManagementNamedValue -Context $apimContext -NamedValueId $functionNvPairName -Name $functionNvPairName -Value $newFunctionHostKey -Secret -Tag @("key", "function", "auto")
    }

    $credentials = New-AzApiManagementBackendCredential -AuthorizationHeaderParameter "x-functions-key" -Header @{"x-functions-key" = @("{{$($functionNvPairName)}}")} 
    Write-Host "Created credentials"

    $backend = New-AzApiManagementBackend `
        -Context $apimContext `
        -BackendId $FunctionName `
        -Url "https://$($FunctionName).azurewebsites.us/api" `
        -Protocol "http" `
        -Description $FunctionName `
        -Title $FunctionName `
        -Credential $credentials `
        -ResourceId "https://management.usgovcloudapi.net$($functionResourceId)"
                                                     
    Write-Host "Created APIM Backend"
    Write-Host ""
    Write-Host ($backend | ConvertTo-Json)

    $ErrorActionPreference = $oldErrorActionPreference

    Write-Host "New-RIPAApimBackend finished:" $FunctionName
}

Export-ModuleMember -Function New-RIPAApimBackend