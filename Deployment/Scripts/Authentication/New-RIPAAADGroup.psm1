Function New-RIPAAADGroup
{
    param (
        [Parameter(Mandatory = $true, HelpMessage = "The name of the group that should be created")] 
        $GroupName, 
        [Parameter(Mandatory = $true, HelpMessage = "The description of the group that should be created")] 
		$Description
	)

    Write-Host "Checking for group" $GroupName "*************** Ignore any onscreen errors ***************"
    $ErrorActionPreference = "Continue"
    $groupExists = az ad group show --only-show-errors --group $GroupName | ConvertFrom-Json
    $ErrorActionPreference = "Stop"

    if($groupExists)
    {
        Write-Host "Group already exists"
        return $groupExists.id
    }

    Write-Host "Creating group" $GroupName
    $adminGroup = az ad group create --display-name $GroupName  --mail-nickname $GroupName --description $Description | ConvertFrom-Json
    
    Write-Host "Using group ID:" $adminGroup.id
    
    return $adminGroup.id
}

Export-ModuleMember -Function New-RIPAAADGroup
