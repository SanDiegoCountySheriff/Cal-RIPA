Function New-FunctionHostKey
{
    # Example: New-FunctionHostKey -ResourceId "/subscriptions/c74e04b6-0cd7-4778-863e-34654eb49270/resourceGroups/sdsd-ripa-q-rg/providers/Microsoft.Web/sites/sdsd-ripa-q-textanalytics-fa" -KeyName "cenkiukeciundkceudc"	
    
    param (
        [Parameter(Mandatory = $true, HelpMessage = "Azure resourceId of the Function App")] 
		$ResourceId, 
        [Parameter(Mandatory = $true, HelpMessage = "The name of the new host key to be created")] 
		$KeyName
	)

    Write-Host "New-FunctionHostKey starting"
    $oldErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Stop"

    $jwtToken = (Get-AzAccessToken -ResourceUrl 'https://management.usgovcloudapi.net').Token
    $body = '{"requests":[{"httpMethod":"PUT","content":{"id":"","properties":{}},"requestHeaderDetails":{"commandName":"createAppKey"},"url":"__RESOURCEID__/host/default/functionKeys/__KEYNAME__?api-version=2018-11-01"}]}'.Replace("__RESOURCEID__", $ResourceId).Replace("__KEYNAME__", $KeyName)

    Write-Host "Got access token"

    $newKey = Invoke-RestMethod `
        -Uri 'https://management.usgovcloudapi.net/batch?api-version=2015-11-01' `
        -Headers @{Authorization = ("Bearer {0}" -f $jwtToken) } `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    $ErrorActionPreference = $oldErrorActionPreference

    Write-Host "New-FunctionHostKey finished"

    return $newKey.responses.content.properties.value
}

Export-ModuleMember -Function New-FunctionHostKey