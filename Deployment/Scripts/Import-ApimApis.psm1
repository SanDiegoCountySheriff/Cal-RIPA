Import-Module Az.ApiManagement -Force
Import-Module Az.Resources -Force


function Import-FunctionApi()
{
	param (
        [Parameter(Mandatory = $true, HelpMessage = "Azure resource group")] 
		$ResourceGroupName, 
        [Parameter(Mandatory = $true, HelpMessage = "Azure API Management instance name")] 
		$ServiceName,
        [Parameter(Mandatory = $true, HelpMessage = "Azure API Management instance name")] 
		$FunctionName, 
        [Parameter(Mandatory = $true, HelpMessage = "functional name of the api (domain, stop, textanalytics, etc.)")] 
		$ApiTag
	)

	Write-Host "Starting ${apiTag} import"

    $ApimCntx = New-AzApiManagementContext -ResourceGroupName $ResourceGroupName -ServiceName $ServiceName
    $functionApp = $FunctionName

    Write-Host "Getting function key code"
    for ($i = 0; $i -le 5; $i++)
    {
        Write-Host "Function key attempt:" $i
        $functionCode = $null
        $functionCode = ((az functionapp function keys list -g $ResourceGroupName -n $functionApp --function-name RenderOpenApiDocument) | ConvertFrom-Json | Select-Object default).default
        if($functionCode)
        {
            break;
        }

        Write-Host "List keys failed. Sleeping 15 seconds"
        Start-Sleep -Seconds 15
    }
	
    $serviceUrl = "https://$($functionApp).azurewebsites.us/api"
	$swaggerUrl = "$($serviceUrl)/openapi/v3.0?code=$($functionCode)"

	Write-Host "Updating ${serviceUrl}"

	# import the latest swagger
	Write-Host "Importing api $ApiTag from $serviceUrl"
    for ($i = 0; $i -le 5; $i++)
	{
        Write-Host "APIM import attempt:" $i
        Write-Host "ApimCntx: $ApimCntx"
        Write-Host "swaggerUrl: $swaggerUrl"
        Write-Host "ApiTag: $ApiTag"
        $importSuccess = (Import-AzApiManagementApi -Context $ApimCntx -SpecificationFormat "OpenApi" -SpecificationUrl $swaggerUrl -Path $ApiTag -ApiId $ApiTag)
        if($importSuccess)
        {
            Write-Host "importSuccess:" $importSuccess
            break;
        }

        Write-Host "APIM import failed. Sleeping 15 seconds"
        Start-Sleep -Seconds 15
    }

    Write-Host "**************************** Checking for backend configuration ****************************"
    Write-Host "******************************** Ignore any onscreen errors ********************************"
    $oldErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continuie"
    $backend = Get-AzApiManagementBackend -Context $ApimCntx -BackendId $functionApp
    $ErrorActionPreference = $oldErrorActionPreference	

    if(!$backend)
    {
        Get-ChildItem -Filter "*New-RIPAApimBackend.psm1" | Rename-Item -NewName "New-RIPAApimBackend.psm1"
        Import-Module .\New-RIPAApimBackend.psm1 -Force
        New-RIPAApimBackend -ResourceGroupName $ResourceGroupName -ServiceName $ServiceName -FunctionName $functionApp
    }

	Write-Host "Setting api backend to point to $ApiTag function"
    $backendPolicy = '<policies><inbound><base /><set-backend-service id="apim-generated-policy" backend-id="__FunctionApp__" /></inbound></policies>'.Replace("__FunctionApp__", $functionApp)
    Set-AzApiManagementPolicy -Context $ApimCntx -ApiId $ApiTag -Policy $backendPolicy 

	# reset the protocol (import modifies this for some reason)
	Write-Host "Updating protocol for $ApiTag at $serviceUrl"
	Set-AzApiManagementApi -Context $ApimCntx -ApiId $ApiTag -Protocols @('https') -Name $ApiTag -ServiceUrl $serviceUrl

	Write-Host "Finished $apiTag import"
}

Export-ModuleMember -Function Import-FunctionApi