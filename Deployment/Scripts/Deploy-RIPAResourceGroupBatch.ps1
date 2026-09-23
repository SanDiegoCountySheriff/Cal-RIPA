# Copyright 2026 SDSO Product Engineering. All rights reserved.

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$TemplateFile,

    [ValidateNotNullOrEmpty()]
    [string]$ParametersFile,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$TargetMapFile,

    [string]$TenantId,

    [string]$ServicePrincipalAppId,

    [string]$ServicePrincipalSecret,

    [switch]$SkipLogin,

    [switch]$SkipWhatIf,

    [switch]$WhatIfOnly,

    [ValidateSet('Incremental', 'Complete')]
    [string]$Mode = 'Incremental',

    [string]$DeploymentNamePrefix = 'ripa',

    [hashtable]$ParameterOverrides
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$DefaultLocation = 'usgovarizona'

function Invoke-AzCli {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments,

        [switch]$CaptureOutput
    )

    $output = & az @Arguments 2>&1

    if ($LASTEXITCODE -ne 0) {
        throw (($output | Out-String).Trim())
    }

    if ($CaptureOutput) {
        return ($output | Out-String).Trim()
    }
}

function Get-ResolvedTargets {
    param(
        [string]$FilePath
    )

    function Get-RowValue {
        param(
            [object]$Row,
            [string[]]$PropertyNames
        )

        foreach ($propertyName in $PropertyNames) {
            $property = $Row.PSObject.Properties[$propertyName]
            if ($null -ne $property -and $null -ne $property.Value) {
                return [string]$property.Value
            }
        }

        return $null
    }

    if (-not (Test-Path -LiteralPath $FilePath)) {
        throw "Target map file not found: $FilePath"
    }

    $rows = Import-Csv -LiteralPath $FilePath
    if (-not $rows -or @($rows).Count -eq 0) {
        throw 'Target map file is empty.'
    }

    $targets = foreach ($row in $rows) {
        $subscriptionId = Get-RowValue -Row $row -PropertyNames @('subscriptionId', 'SubscriptionId')
        $resourceGroupName = Get-RowValue -Row $row -PropertyNames @('resourceGroupName', 'ResourceGroupName')
        if ($subscriptionId) {
            $subscriptionId = $subscriptionId.Trim()
        }

        if ($resourceGroupName) {
            $resourceGroupName = $resourceGroupName.Trim()
        }

        if (-not $subscriptionId) {
            throw 'Each target row must include subscriptionId.'
        }

        if (-not $resourceGroupName) {
            throw "Each target row must include resourceGroupName for subscription '$subscriptionId'."
        }

        [pscustomobject]@{
            SubscriptionId   = $subscriptionId
            ResourceGroupName = $resourceGroupName
        }
    }

    return @($targets)
}

function Get-DeploymentParameters {
    param(
        [string]$ParametersPath,
        [hashtable]$Overrides
    )

    $arguments = @()

    if ($ParametersPath) {
        if (-not (Test-Path -LiteralPath $ParametersPath)) {
            throw "Parameters file not found: $ParametersPath"
        }

        $arguments += $ParametersPath
    }

    if ($Overrides) {
        foreach ($entry in $Overrides.GetEnumerator()) {
            $arguments += ("{0}={1}" -f $entry.Key, $entry.Value)
        }
    }

    return $arguments
}

function Assert-TemplateFile {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Template file not found: $Path"
    }
}

function Ensure-Login {
    param(
        [string]$Tenant,
        [string]$ClientId,
        [string]$Secret,
        [switch]$ShouldSkipLogin
    )

    Invoke-AzCli -Arguments @('cloud', 'set', '--name', 'AzureUSGovernment') | Out-Null

    if ($ShouldSkipLogin) {
        return
    }

    if (-not $Tenant) {
        throw 'TenantId is required.'
    }

    if (-not $ClientId) {
        throw 'ServicePrincipalAppId is required.'
    }

    if (-not $Secret) {
        throw 'ServicePrincipalSecret is required.'
    }

    Invoke-AzCli -Arguments @(
        'login',
        '--service-principal',
        '--username', $ClientId,
        '--password', $Secret,
        '--tenant', $Tenant
    ) | Out-Null
}

Assert-TemplateFile -Path $TemplateFile

$targets = Get-ResolvedTargets -FilePath $TargetMapFile
$deploymentParameters = Get-DeploymentParameters -ParametersPath $ParametersFile -Overrides $ParameterOverrides

Ensure-Login -Tenant $TenantId -ClientId $ServicePrincipalAppId -Secret $ServicePrincipalSecret -ShouldSkipLogin:$SkipLogin

$results = @()
$timestamp = Get-Date -Format 'yyyyMMddHHmmss'

foreach ($target in $targets) {
    $subscriptionId = $target.SubscriptionId
    $resourceGroupName = $target.ResourceGroupName

    Write-Host "Processing subscription $subscriptionId / resource group $resourceGroupName" -ForegroundColor Cyan

    Invoke-AzCli -Arguments @('account', 'set', '--subscription', $subscriptionId) | Out-Null

    $sanitizedSubscription = ($subscriptionId -replace '[^a-zA-Z0-9]', '')
    $safeSubscription = $sanitizedSubscription.Substring(0, [Math]::Min(8, $sanitizedSubscription.Length))
    $sanitizedResourceGroup = ($resourceGroupName -replace '[^a-zA-Z0-9]', '')
    $safeResourceGroup = $sanitizedResourceGroup.Substring(0, [Math]::Min(8, $sanitizedResourceGroup.Length))

    if (-not $safeSubscription) {
        $safeSubscription = ([guid]::NewGuid().ToString('N')).Substring(0, 8)
    }

    if (-not $safeResourceGroup) {
        $safeResourceGroup = ([guid]::NewGuid().ToString('N')).Substring(0, 8)
    }

    $deploymentName = '{0}-{1}-{2}-{3}' -f $DeploymentNamePrefix, $safeSubscription, $safeResourceGroup, $timestamp

    $commonArguments = @(
        'deployment', 'group', 'create',
        '--resource-group', $resourceGroupName,
        '--name', $deploymentName,
        '--template-file', $TemplateFile,
        '--mode', $Mode,
        '--no-prompt'
    )

    if ($deploymentParameters.Count -gt 0) {
        $commonArguments += '--parameters'
        $commonArguments += $deploymentParameters
    }

    if (-not $SkipWhatIf) {
        Write-Host "Running what-if for $deploymentName" -ForegroundColor DarkGray
        $whatIfArguments = @(
            'deployment', 'group', 'what-if',
            '--resource-group', $resourceGroupName,
            '--name', $deploymentName,
            '--template-file', $TemplateFile,
            '--mode', $Mode,
            '--no-prompt'
        )

        if ($deploymentParameters.Count -gt 0) {
            $whatIfArguments += '--parameters'
            $whatIfArguments += $deploymentParameters
        }

        Invoke-AzCli -Arguments $whatIfArguments | Out-Null

        if ($WhatIfOnly) {
            $results += [pscustomobject]@{
                SubscriptionId = $subscriptionId
                ResourceGroup  = $resourceGroupName
                DeploymentName = $deploymentName
                Status         = 'WhatIfOnly'
                Message        = 'What-if completed; deployment skipped.'
            }

            continue
        }
    }

    Write-Host "Creating deployment $deploymentName" -ForegroundColor Green
    Invoke-AzCli -Arguments $commonArguments | Out-Null

    $results += [pscustomobject]@{
        SubscriptionId = $subscriptionId
        ResourceGroup  = $resourceGroupName
        DeploymentName = $deploymentName
        Status         = 'Succeeded'
        Message        = 'Deployment completed.'
    }
}

$results | Format-Table -AutoSize
