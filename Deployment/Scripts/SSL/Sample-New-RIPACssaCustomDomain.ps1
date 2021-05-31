Import-Module .\New-RIPACssaCustomDomain.psm1 -Force 

$Subscription = "1340e16e-8c9e-44b7-9b12-78ed3c74211b"
$ResourceGroupName = "shared-keep-rg"
$CdnProfileName = "lesmcwhirter-me-cdn"
$DnsRootZone = "lesmcwhirter.me"

$AgencyAbrieviation = "salsa"
$ApplicationName = "green"

$KeyVaultName = "shared-keep-kv"
$SecretName = "star-lesmcwhirter-me"
$SecretVersion = "Latest"

$WebContentUrl = "ripacdntestwebsa.z13.web.core.windows.net"

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
