Import-Module .\New-RIPACssaCustomDomain.psm1 -Force 

$Subscription = "********-****-****-****-************"
$ResourceGroupName = "cssa-shared-rg"
$CdnProfileName = "cssa-cloud-cdn"
$DnsRootZone = "cssa.cloud"

$AgencyAbrieviation = "salsa"
$ApplicationName = "green"

$KeyVaultName = "cssa-shared-kv"
$SecretName = "star-cssa-cloud"
$SecretVersion = "Latest"

$WebContentUrl = "staticwebcontent.z13.web.core.windows.net"

New-RIPACssaCustomDomain `
    -Subscription $Subscription `
    -ResourceGroupName $ResourceGroupName `
    -CdnProfileName $CdnProfileName `
    -DnsRootZone $DnsRootZone `
    -AgencyAbrieviation $AgencyAbrieviation `
    -ApplicationName $ApplicationName `
    -KeyVaultName $KeyVaultName `
    -SecretName $SecretName `
    -SecretVersion $SecretVersion `
    -WebContentUrl $WebContentUrl 
