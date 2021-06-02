# This script will create the main package used to publish an Azure Marketplace Offering of the Cal-RIPA application

Function New-ApiDeploymentPackage
{
    param (
        [Parameter(Mandatory = $true)] 
		$ProjectName,
        [Parameter(Mandatory = $true)] 
		$ProjectLocation,
        [Parameter(Mandatory = $true)] 
		$packagesDestinationPath
    )
    
    Write-Host "CD to project directory" $ProjectName
    Set-Location $ProjectLocation 
    Write-Host

    $publishFolder = (Get-Location).Path | Join-Path -ChildPath "\bin\publish" 

    Write-Host "Calling dotnet restore" $ProjectName
    dotnet restore --force
    Write-Host

    Write-Host "Calling dotnet build" $ProjectName
    dotnet build -c Release
    Write-Host

    Write-Host "Calling dotnet publish" $ProjectName
    dotnet publish --no-build -c Release --framework netcoreapp3.1 -o $publishFolder
    Write-Host

    Write-Host "Compressing deployment package" $ProjectName
    $gac = ([System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem"))
    $compressedFile = ([System.IO.Compression.ZipFile]::CreateFromDirectory("$($publishFolder)\", "$($packagesDestinationPath)\$($ProjectName).zip", "Optimal", $false))
    Write-Host "Created deployment package: $($packagesDestinationPath)\$($ProjectName).zip"
    Write-Host
}

Function New-UiDeploymentPackage
{
    param (
        [Parameter(Mandatory = $true)] 
		$ProjectName,
        [Parameter(Mandatory = $true)] 
		$ProjectLocation,
        [Parameter(Mandatory = $true)] 
		$packagesDestinationPath
    )
    
    Write-Host "CD to project directory"
    Set-Location $ProjectLocation 
    Write-Host
        
    Write-Host "********************************************* Ignore On Screen Error *********************************************"
    $ErrorActionPreference = "Continue"
    Remove-Item "package-lock.json" -Force 
    #Remove-Item "\node_modules" -Recurse -Force 
    Write-Host

    Write-Host "Calling npm install"
    $install = (npm install --legacy-peer-deps --save)
    Write-Host

    Write-Host "Calling npm build"
    $build = (npm run build )
    Write-Host

    $ErrorActionPreference = "Stop"

    $publishFolder = (Get-Location).Path | Join-Path -ChildPath "dist" 
    
    Write-Host "Copying base config.json"
    $configContent = Get-Content -Path ".\config\mp.config.json"
    Set-Content -Path "$($publishFolder)\config.json" -Value $configContent
    Write-Host

    Write-Host "Compressing deployment package"
    $gac = ([System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression.FileSystem"))
    $compressedFile = ([System.IO.Compression.ZipFile]::CreateFromDirectory("$($publishFolder)\", "$($packagesDestinationPath)\$($ProjectName).zip", "Optimal", $false))
    Write-Host "Created deployment package: $($packagesDestinationPath)\$($ProjectName).zip"
    Write-Host
}

# Set location to the root of the GitHub repository
# Change this as needed for your particular repo location
$repoRootDirectory = "C:\insight\CSSA\Cal-RIPA"
Set-Location $repoRootDirectory

$marketplaceRootDirectory = Join-Path -Path $repoRootDirectory -ChildPath ".\Deployment\IaC\Marketplace"
Set-Location $marketplaceRootDirectory

$rootDirectory = ".\working-directory"

Write-Host "********************************************* Ignore On Screen Error *********************************************"
$ErrorActionPreference = "Continue"
Remove-Item $rootDirectory -Recurse -Force
$ErrorActionPreference = "Stop"

$workingDirectory = (New-Item -ItemType Directory -Force -Path $rootDirectory).FullName
$scriptsDestinationPath = Join-Path -Path $workingDirectory -ChildPath "scripts"
$packagesDestinationPath = (New-Item -ItemType Directory -Force -Path "$($workingDirectory)\packages").FullName

Join-Path -Path $workingDirectory -ChildPath "packages"

Write-Host "Using working directory:" $workingDirectory

Write-Host "Copying main Marketplace template files"
Copy-Item ".\createUiDefinition.json" -Destination $workingDirectory
Copy-Item ".\mainTemplate.json" -Destination $workingDirectory

Write-Host "Copying all script files"
Copy-Item "..\..\Scripts" -Recurse -Force -Destination $scriptsDestinationPath

Write-Host "Creating deployment packages"
$functionsRootDirectory = Join-Path -Path $repoRootDirectory -ChildPath "Functions"

Set-Location $functionsRootDirectory
New-ApiDeploymentPackage -ProjectName "domain" -ProjectLocation ".\RIPA.Functions.Domain" -packagesDestinationPath $packagesDestinationPath

Set-Location $functionsRootDirectory
New-ApiDeploymentPackage -ProjectName "userprofile" -ProjectLocation ".\RIPA.Functions.UserProfile" -packagesDestinationPath $packagesDestinationPath

Set-Location $functionsRootDirectory
New-ApiDeploymentPackage -ProjectName "stop" -ProjectLocation ".\RIPA.Functions.Stop" -packagesDestinationPath $packagesDestinationPath

Set-Location $functionsRootDirectory
New-ApiDeploymentPackage -ProjectName "textanalytics" -ProjectLocation ".\RIPA.Functions.TextAnalytics" -packagesDestinationPath $packagesDestinationPath

Set-Location $functionsRootDirectory
New-ApiDeploymentPackage -ProjectName "submission" -ProjectLocation ".\RIPA.Functions.Submission" -packagesDestinationPath $packagesDestinationPath

Set-Location $repoRootDirectory
New-UiDeploymentPackage -ProjectName "ui" -ProjectLocation ".\UI" -packagesDestinationPath $packagesDestinationPath

Set-Location $repoRootDirectory

Write-Host "Creating final marketplace offering package"
$compress = @{
  Path = "$($workingDirectory)\*"
  CompressionLevel = "Optimal"
  DestinationPath = "$($workingDirectory)\market-place-offering.zip"
}
Compress-Archive @compress -Force

Write-Host "Created final marketplace offering package"
Write-Host "Done"