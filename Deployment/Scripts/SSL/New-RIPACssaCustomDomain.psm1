Function New-RIPACssaCustomDomain {

    Param(
        [Parameter(Mandatory = $true, HelpMessage = "Subscription hosting the the DNS Zone, Key Vault & CDN Profile")] 
        $Subscription, 
        [Parameter(Mandatory = $true, HelpMessage = "Resource Group name where ")] 
        $ResourceGroupName, 
        [Parameter(Mandatory = $true, HelpMessage = "Root CDN Profile name")] 
		$CdnProfileName, 
        [Parameter(Mandatory = $true, HelpMessage = "Main/root domain name, i.e. cssa.cloud")] 
        $DnsRootZone, 
        [Parameter(Mandatory = $true, HelpMessage = "A short abbrieviation of the agency (must be unique), i.e. sdsd for San Diego Sheriffs Department")] 
        $AgencyAbrieviation, 
        [Parameter(Mandatory = $true, HelpMessage = "Name of the application being created, i.e. ripa or tagrs")] 
        $ApplicationName, 
        [Parameter(Mandatory = $true, HelpMessage = "Key Vault name where a wildcard certificate exists")] 
        $KeyVaultName, 
        [Parameter(Mandatory = $true, HelpMessage = "Name of the secret where the certificate has been stored, i.e. star-cssa-cloud")] 
        $SecretName, 
        [Parameter(Mandatory = $false, HelpMessage = "The version of the Key Vault secret. Defaults to 'Latest' the prefered value")] 
        $SecretVersion = "Latest", 
        [Parameter(Mandatory = $true, HelpMessage = "The host name of the site where the static content is hosted, usually a Static Web in a storage account. 'staticweb.z13.web.core.windows.net'")] 
        $WebContentUrl
    )

    $DnsSubDomainName = $ApplicationName + "-" + $AgencyAbrieviation
    $DnsHostName = ($DnsSubDomainName + "." + $DnsRootZone)
    $EndpointName = $DnsSubDomainName + "-cdn-ep"
    $CName = $EndpointName + ".azureedge.net"
    $DnsHostName_Name = ($DnsHostName).Replace(".",  "").Replace("-",  "")

    # Creates DNS  CDN Endpoints and configures custom DNS for cssa.cloud based URLs
    Write-Host "Starting DNS/Custom Host/Certificate deployment"
    Write-Host ""

    $ErrorActionPreference = "Stop"

    $CompressedContentTypes = @(
        "application/eot",
        "application/font",
        "application/font-sfnt",
        "application/javascript",
        "application/json",
        "application/opentype",
        "application/otf",
        "application/pkcs7-mime",
        "application/truetype",
        "application/ttf",
        "application/vnd.ms-fontobject",
        "application/xhtml+xml",
        "application/xml",
        "application/xml+rss",
        "application/x-font-opentype",
        "application/x-font-truetype",
        "application/x-font-ttf",
        "application/x-httpd-cgi",
        "application/x-javascript",
        "application/x-mpegurl",
        "application/x-opentype",
        "application/x-otf",
        "application/x-perl",
        "application/x-ttf",
        "font/eot",
        "font/ttf",
        "font/otf",
        "font/opentype",
        "image/svg+xml",
        "text/css",
        "text/csv",
        "text/html",
        "text/javascript",
        "text/js",
        "text/plain",
        "text/richtext",
        "text/tab-separated-values",
        "text/xml",
        "text/x-script",
        "text/x-component",
        "text/x-java-source"
    )

    $DnsSubDomainName = $ApplicationName + "-" + $AgencyAbrieviation
    $DnsHostName = ($DnsSubDomainName + "." + $DnsRootZone)
    $EndpointName = $DnsSubDomainName + "-cdn-ep"
    $CName = $EndpointName + ".azureedge.net"
    $DnsHostName_Name = ($DnsHostName).Replace(".",  "").Replace("-",  "")

    Write-Host "Using Subscription: " $Subscription
    Write-Host "Using ResourceGroupName: " $ResourceGroupName
    Write-Host "Using CdnProfileName: " $CdnProfileName
    Write-Host "Using DnsRootZone: " $DnsRootZone
    Write-Host ""

    Write-Host "Using AgencyAbrieviation: " $AgencyAbrieviation
    Write-Host "Using ApplicationName: " $ApplicationName
    Write-Host ""

    Write-Host "Using KeyVaultName: " $KeyVaultName
    Write-Host "Using SecretName: " $SecretName
    Write-Host "Using SecretVersion: " $SecretVersion
    Write-Host ""

    Write-Host "Using DnsSubDomainName: " $DnsSubDomainName
    Write-Host "Using DnsHostName: " $DnsHostName
    Write-Host "Using EndpointName: " $EndpointName
    Write-Host "Using CName: " $CName
    Write-Host "Using DnsHostName_Name: " $DnsHostName_Name
    Write-Host ""

    Write-Host "Using WebContentUrl: " $WebContentUrl
    Write-Host ""

    # Create DNS CNAMEs for the application URL and for CDN Verify
    Write-Host "Creating/updating DNS"
    Write-Host ""
    az network dns record-set cname set-record --subscription $Subscription -g $ResourceGroupName -z $DnsRootZone -n $DnsSubDomainName -c $CName
    az network dns record-set cname set-record --subscription $Subscription -g $ResourceGroupName -z $DnsRootZone -n cdnverify.$DnsSubDomainName -c cdnverify.$CName

    Write-Host ""
    Write-Host "Creating CDN Endpoint" $EndpointName
    Write-Host ""
    az cdn endpoint create `
        --resource-group $ResourceGroupName `
        --location "Global" `
        --profile-name $CdnProfileName `
        --name $EndpointName `
        --origin $WebContentUrl `
        --origin-host-header $WebContentUrl `
        --enable-compression true `
        --no-http false `
        --no-https false `
        --tags agency=$AgencyAbrieviation application=$ApplicationName
    
        # Currently, there is an open defect for this parameter
        # https://github.com/Azure/azure-cli/issues/13935 
        #--content-types-to-compress $CompressedContentTypes `

    Write-Host ""
    Write-Host "Creating custom domain" $DnsHostName
    Write-Host ""
    az cdn custom-domain create `
        --resource-group $ResourceGroupName `
        --profile-name $CdnProfileName `
        --endpoint-name $EndpointName `
        --hostname $DnsHostName `
        --name $DnsHostName_Name

    Write-Host ""
    Write-Host "Enabling HTTPS on custom domain" $DnsHostName
    Write-Host ""
    az cdn custom-domain enable-https `
        --resource-group $ResourceGroupName `
        --profile-name $CdnProfileName `
        --endpoint-name $EndpointName `
        --name $DnsHostName_Name `
        --min-tls-version 1.2 `
        --user-cert-subscription-id $Subscription `
        --user-cert-group-name $ResourceGroupName `
        --user-cert-vault-name $KeyVaultName `
        --user-cert-secret-name $SecretName `
        --user-cert-protocol-type 'sni'

    Write-Host ""
    Write-Host "Creating HTTP Redirect rule - *** Ignore onscreen warnings ***"
    Write-Host ""
    az cdn endpoint rule add `
        --resource-group $ResourceGroupName `
        --profile-name $CdnProfileName `
        --name $EndpointName `
        --order 1 `
        --rule-name "HttpRedirect" `
        --match-variable RequestScheme `
        --operator Equal `
        --match-values HTTP `
        --action-name "UrlRedirect" `
        --redirect-protocol Https `
        --redirect-type PermanentRedirect

    Write-Host "Finished DNS/Custom Host/Certificate deployment"
}

Export-ModuleMember -Function New-RIPACssaCustomDomain