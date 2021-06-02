
# ripa - agencyx-ripa-cdn-ep.azureedge.net
# cdnverify.ripa - cdnverify.agencyx-ripa-cdn-ep.azureedge.net

$CdnProfileName = "agencyx-cdn"
$ResourceGroupName = "AgencyX-rg"
$EndpointName = "agencyx-ripa-cdn-ep"
$DnsHostName = "ripa.agencyxx.lesmcwhirter.me"

az cdn custom-domain enable-https --resource-group AgencyX-rg --profile-name agencyx-cdn --endpoint-name agencyx-ripa-cdn-ep --name ripa.agencyxx.lesmcwhirter.me --min-tls-version 1.2 --debug

# az cdn custom-domain create --endpoint-name $EndpointName --hostname $DnsHostName --name $EndpointName --profile-name $CdnProfileName --resource-group $ResourceGroupName

#az cdn custom-domain enable-https --resource-group $ResourceGroupName --profile-name $CdnProfileName --endpoint-name $EndpointName --name "$($DnsHostName)" --min-tls-version 1.2
#--user-cert-subscription-id 1340e16e-8c9e-44b7-9b12-78ed3c74211b --user-cert-group-name shared-keep-rg --user-cert-vault-name shared-keep-kv --user-cert-secret-name star-lesmcwhirter-me --user-cert-secret-version "Lastest" --user-cert-protocol-type 'sni'

/subscriptions/525114a1-62c2-4df0-ad7d-fcac3c5cac8e/resourceGroups/AgencyX-rg/providers/Microsoft.Cdn/profiles/agencyx-cdn/endpoints/agencyx-ripa-cdn-ep/customDomains/ripa.agencyxx.lesmcwhirter.me/enableCustomHttps?api-version=2020-09-01


$CdnProfileName = "agencyx-cdn"
$ResourceGroupName = "AgencyX-rg"
$EndpointName = "agencyx-ripa-cdn-ep"
$DnsHostName = "ripa.agencyxx.lesmcwhirter.me"

Enable-AzCdnCustomDomainHttps -ResourceGroupName $resourceGroupName -ProfileName $CdnProfileName -EndpointName $EndpointName -CustomDomainName $DnsHostName
