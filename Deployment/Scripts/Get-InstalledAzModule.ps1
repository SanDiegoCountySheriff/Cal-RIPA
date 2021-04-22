function Get-InstalledAzModule()
{
    Write-Host "Checking Powershell Module Az"
    
    $AzModuleVersion = (Get-InstalledModule -Name Az | Select-Object -Property Version)
    if($AzModuleVersion) 
    {
        Write-Host "Powershell Module Az is installed. Checking version now."
        $MajorMinor = "$($AzModuleVersion.Version.Major).$($AzModuleVersion.Version.Minor)"
        $AzVersionNumber = [decimal]$MajorMinor
        if($AzVersionNumber -lt 5.4)
        {
            Write-Host "Your Powershell Az Module version is $($AzVersionNumber), however the minimum required version is 5.4. Upgrading now..."
            Update-Module -Name Az -Force
            Import-Module Az
        }
        else
        {
            Write-Host "Powershell Module Az version is good."
        }
    }
    else
    {
        Write-Host "You do not have Powershell Az Module installed. Installing now..."
        Install-Module -Name Az -Scope AllUsers -AllowClobber 
        Import-Module Az
    }
}

Get-InstalledAzModule