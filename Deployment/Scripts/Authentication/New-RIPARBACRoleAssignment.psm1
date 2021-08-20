Function New-RIPARBACRoleAssignment
{   
	param (
        [Parameter(Mandatory = $true, HelpMessage = "The ObjectId of the AAD Enterprise Application for the Group/Role assignment")] 
        $EnterpriseAppObjectId, 
        [Parameter(Mandatory = $true, HelpMessage = "The ObjectId of the AAD Group to be assigned to the App Registration Role")] 
		$ADGroupId, 
        [Parameter(Mandatory = $true, HelpMessage = "The id of the Role defined in the App Registration Roles")] 
		$AppRoleId
	)

    # Usage 
    # 
    # $EnterpriseObjectId = "ad3c8811-ec11-4845-be90-69b5d1a911fb"
    # $ADGroupId = "67c1b2df-4f88-47cb-85c4-61abc845d583"
    # $AppRoleId = "bd1f63c5-7525-4db1-bd97-09def6c07edf"
    #
    # New-EnterpriseAppRbacRoleAssingment -EnterpriseObjectId $EnterpriseObjectId -ADGroupId $ADGroupId -AppRoleId $AppRoleId
    # 

    Write-Host "Creating RBAC Role assignment for role" $AppRoleId

    # ************************************ DO NOT MODIFY ************************************ 
    # resourceId 74658136-14ec-4630-ad9b-26e160ff0fc6 is a well known id for https://main.iam.ad.ext.azure.com 
    # resourceId ee62de39-b9b0-4886-aa58-08b89c4e3db3 is a well known id for https://main.iam.ad.ext.azure.us ## AzureUsGovernment 
    # which is a backplain endpoint for the Azure environment & portal 

    $resourceId = "74658136-14ec-4630-ad9b-26e160ff0fc6"
    $resourceUrl = "main.iam.ad.ext.azure.com"

    $cloud = (az cloud show) | ConvertFrom-Json
    Write-Host $cloud

    if($cloud.name -eq "AzureUSGovernment")
    {
        $resourceId = "ee62de39-b9b0-4886-aa58-08b89c4e3db3"
        $resourceUrl = "main.iam.ad.ext.azure.us"
    }

    $token=$(az account get-access-token --resource "$resourceId" --query accessToken --output tsv)
    $requestId = (New-Guid).Guid
    $body = "{'objectId':'$($EnterpriseAppObjectId)','applicationRoleId':'$($AppRoleId)','userId':null,'groupId':'$($ADGroupId)','passwordSSOCredentials':null}"
    $authorization = @{ 
        Authorization = "Bearer $($token)" 
        "x-ms-client-request-id" = $requestId 
    }
    $url = "https://$($resourceUrl)/api/ManagedApplications/$($EnterpriseAppObjectId)/AppRoleAssignments"

    Invoke-RestMethod -Method POST -Uri $url -Headers $authorization -ContentType "application/json" -Body $body

    Write-Host "RBAC Role created" $AppRoleId
}

Export-ModuleMember -Function New-RIPARBACRoleAssignment