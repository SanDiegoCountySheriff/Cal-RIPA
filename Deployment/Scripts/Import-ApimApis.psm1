Import-Module Az.ApiManagement -Force
Import-Module Az.Resources -Force

# Helper: Robust retrieval of a function-specific key for the OpenAPI (RenderOpenApiDocument) function
function Get-RenderOpenApiFunctionKey {
    param(
        [Parameter(Mandatory=$true)] $ResourceGroupName,
        [Parameter(Mandatory=$true)] $FunctionAppName,
        [Parameter(Mandatory=$false)] $FunctionName = 'RenderOpenApiDocument'
    )

    Write-Host "[KeyRetrieval] Starting attempts to fetch function key for $FunctionAppName/$FunctionName"
    $attemptErrors = @()

    # Attempt 1: Original CLI command (function-level keys)
    for($i=1; $i -le 3; $i++) {
        try {
            Write-Host "[KeyRetrieval] Attempt $i via 'az functionapp function keys list'"
            $raw = az functionapp function keys list -g $ResourceGroupName -n $FunctionAppName --function-name $FunctionName 2>&1
            if($LASTEXITCODE -eq 0 -and $raw) {
                $parsed = $raw | ConvertFrom-Json -ErrorAction Stop
                if($parsed.default) { Write-Host "[KeyRetrieval] Success via function keys list"; return $parsed.default }
                if($parsed | Get-Member -Name "functionKeys" -ErrorAction SilentlyContinue) {
                    # Some CLI versions may return grouped structure
                    $val = $parsed.functionKeys.default
                    if($val) { Write-Host "[KeyRetrieval] Success (grouped structure)"; return $val }
                }
            }
            Write-Host "[KeyRetrieval] Attempt $i failed or key empty. Sleeping 5s"; Start-Sleep -Seconds 5
    } catch { $attemptErrors += "CLI(function keys list) attempt $($i): $($_.Exception.Message)" }
    }

    # Attempt 2: Host-level keys listing (sometimes function key appears here in newer runtimes)
    try {
        Write-Host "[KeyRetrieval] Attempt host key enumeration via 'az functionapp keys list'"
        $rawHost = az functionapp keys list -g $ResourceGroupName -n $FunctionAppName 2>&1
        if($LASTEXITCODE -eq 0 -and $rawHost) {
            $parsedHost = $rawHost | ConvertFrom-Json -ErrorAction Stop
            if($parsedHost.functionKeys) {
                $candidate = $parsedHost.functionKeys.$FunctionName
                if($candidate) { Write-Host "[KeyRetrieval] Success via host keys list"; return $candidate }
                $defaultCandidate = $parsedHost.functionKeys.default
                if($defaultCandidate) { Write-Host "[KeyRetrieval] Falling back to default function key from host keys list"; return $defaultCandidate }
            }
        } else {
            $attemptErrors += "CLI(host keys list) exitCode=$LASTEXITCODE output=$rawHost"
        }
    } catch { $attemptErrors += "CLI(host keys list): $($_.Exception.Message)" }

    # Attempt 3: Direct REST management API call (requires RBAC permission Microsoft.Web/sites/functions/listkeys/action)
    try {
        Write-Host "[KeyRetrieval] Attempt direct REST call to management API"
        $subId = (Get-AzContext).Subscription.Id
        $token = (Get-AzAccessToken -ResourceUrl 'https://management.usgovcloudapi.net').Token
        $restUri = "https://management.usgovcloudapi.net/subscriptions/$subId/resourceGroups/$ResourceGroupName/providers/Microsoft.Web/sites/$FunctionAppName/functions/$FunctionName/listKeys?api-version=2022-03-01"
        $resp = Invoke-RestMethod -Uri $restUri -Method POST -Headers @{Authorization = "Bearer $token"}
        if($resp.default) { Write-Host "[KeyRetrieval] Success via REST listKeys"; return $resp.default }
        if($resp.Keys) {
            $first = $resp.Keys | Select-Object -First 1
            if($first.value) { Write-Host "[KeyRetrieval] Using first returned key via REST"; return $first.value }
        }
        $attemptErrors += "REST(listKeys) returned unexpected structure: $($resp | Out-String)"
    } catch { $attemptErrors += "REST(listKeys): $($_.Exception.Message)" }

    Write-Warning "[KeyRetrieval] Failed to obtain function key. Aggregated info:" 
    $attemptErrors | ForEach-Object { Write-Warning " - $_" }
    throw "Unable to retrieve function key for $FunctionAppName/$FunctionName after multiple strategies."
}


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

    Write-Host "Getting function key code (with resilient strategy)"
    $functionCode = Get-RenderOpenApiFunctionKey -ResourceGroupName $ResourceGroupName -FunctionAppName $functionApp -FunctionName 'RenderOpenApiDocument'
	
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
    # Correct typo: "Continue"
    $ErrorActionPreference = "Continue"
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