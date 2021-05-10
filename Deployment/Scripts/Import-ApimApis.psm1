Import-Module Az.ApiManagement -Force
Import-Module Az.Resources -Force


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
    $functionApp = "sdsd-ripa-$($Environment)-$($ApiTag)-fa"

    Write-Host "Getting function key code"
    $functionCode = ((az functionapp function keys list -g "sdsd-ripa-$($Environment)-rg" -n $functionApp --function-name RenderOpenApiDocument) | ConvertFrom-Json | Select-Object default).default
	
    $serviceUrl = "https://$($functionApp).azurewebsites.us/api"
	$swaggerUrl = "$($serviceUrl)/openapi/v3.0?code=$($functionCode)"

	Write-Host "Updating ${serviceUrl}"

	# import the latest swagger
	Write-Host "Importing api $ApiTag from $swaggerUrl"
	Import-AzApiManagementApi -Context $ApimCntx -SpecificationFormat "OpenApi" -SpecificationUrl $swaggerUrl -Path $ApiTag -ApiId $ApiTag

    Write-Host "* ************************** Checking for backend configuration ****************************"
    Write-Host "******************************** Ignore any onscreen errors ********************************"
    $oldErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continuie"
    $backend = Get-AzApiManagementBackend -Context $ApimCntx -BackendId $functionApp
    $ErrorActionPreference = $oldErrorActionPreference	

    if(!$backend)
    {
        Import-Module .\New-RIPAApimBackend.psm1 -Force
        New-RIPAApimBackend -ResourceGroupName $ResourceGroupName -ServiceName $ServiceName -FunctionName $functionApp
    }

	Write-Host "Setting api backend to point to $ApiTag function"
    $backendPolicy = '<policies><inbound><base /><set-backend-service id="apim-generated-policy" backend-id="__FunctionApp__" /></inbound></policies>'.Replace("__FunctionApp__", $functionApp)
    Set-AzApiManagementPolicy -Context $ApimCntx -ApiId $ApiTag -Policy $backendPolicy 

	# reset the protocol (import modifies this for some reason)
	Write-Host "Updating protocol for $($api.Name) at $serviceUrl"
	Set-AzApiManagementApi -Context $ApimCntx -ApiId $ApiTag -Protocols @('https') -Name $ApiTag -ServiceUrl $serviceUrl

	Write-Host "Finished ${apiTag} import"
}

Export-ModuleMember -Function Import-FunctionApi