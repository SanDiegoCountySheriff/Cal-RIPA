Function New-RIPAAppRegistration
{
    param (
        [Parameter(Mandatory = $true, HelpMessage = "The name of the App Registration that should be created")]
        $DisplayName, 
        [Parameter(Mandatory = $true, HelpMessage = "The description of the group that should be created")]
		$Description, 
        [Parameter(Mandatory = $true, HelpMessage = "The web application reply URI for post authentication")]
		$ReplyUri
	)

    Write-Host "New-RIPAAppRegistration starting"

    $manifestJsonFilePath = ".\Ripa-GraphPolicyManifest.json"
    $claimsJsonFilePath = ".\Ripa-ClaimsManifest.json"
    $rolesJsonFilePath = ".\Ripa-RolesManifest.json"

    $waitTime = 30

    # Write-Host "Get app with display name $DisplayName"
    # $adApplication = az ad app list --display-name $DisplayName | ConvertFrom-Json
				
    Write-Host "Create app with display name $DisplayName"
    $adApplication = az ad app create `
        --display-name $DisplayName `
        --available-to-other-tenants $false `
        --oauth2-allow-implicit-flow $false `
        --required-resource-access $manifestJsonFilePath `
        --optional-claims $claimsJsonFilePath `
        --app-roles $rolesJsonFilePath `
        --reply-urls $ReplyUri `
        | ConvertFrom-Json

    Write-Host "Waiting $waitTime seconds for app registration to propogate..."
    Start-Sleep -Seconds $waitTime

    $appId = $adApplication.appId

    Write-Host "Created app with display name $DisplayName"
		
    Write-Host "Apply admin consent for app permissions"
    az ad app permission admin-consent --id $appId

    Write-Host "Waiting $waitTime seconds for app service principal to propogate..."
    Start-Sleep -Seconds $waitTime

    Write-Host "Assigning app ownership to current user"
    $currentUserObjectId = (az ad signed-in-user show | ConvertFrom-Json).objectId
    az ad app owner add --id $appId --owner-object-id $currentUserObjectId

    Write-Host "Turning on role assignment required flag"
    $servicePrincipal = az ad sp update --id $appId --set appRoleAssignmentRequired=true

    Write-Host "Setting app API uri"
    az ad app update --id $appId --identifier-uris "api://$($appId)"

    Write-Host "Get final app details"
    $adApplication = az ad app list --display-name $DisplayName | ConvertFrom-Json
		
    Write-Host "Get service principal id for app with display name $DisplayName"
    $servicePrincipal = az ad sp list --display-name $DisplayName | ConvertFrom-Json

    $adApplicationProperties = @{
        ApplicationId = $adApplication.appId
        DisplayName = $adApplication.displayName
	    IdentifierUris = $adApplication.identifierUris
	    ServicePrincipalId =  $servicePrincipal.objectId
        ReplyUrls = $ServicePrincipal.replyUrls
    } | ConvertTo-Json

    Write-Host $adApplicationProperties

    return $adApplicationProperties
}

Export-ModuleMember -Function New-RIPAAppRegistration