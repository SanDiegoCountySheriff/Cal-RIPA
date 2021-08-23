# Creates DNS & CDN Endpoints and configures custom DNS for cssa.cloud based URLs
echo
echo
echo "Starting DNS/Custom Host/Certificate deployment"
echo

# CLOUD_TYPE: This identifies the Azure Cloud that this application is being deployed to
# CSSA_SP_APP_ID: This is a Service Principal that has been granted access to the core CSSA global resources
# CSSA_SP_SECRET: This is the password/secret for the Service Principal
# CSSA_TENANT_ID: This is the core CSSA Tenant ID 
# CSSA_SUBSCRIPTION_ID: This is the CSSA Subscription ID where the CSSA global resources are
# CSSA_RESOURCE_GROUP_NAME: This is the main resource group where the CSSA global are. KV, CDN, DNS Zone (sdsd-gen-p-rg)
# CSSA_CDN_PROFILE_NAME: This is the CSSA global DNS Zone resource name (cssa.cloud)
# CSSA_DNS_ROOT_ZONE: This is the root DNS entry for the CSSA DNS ZOne (cssa.cloud)
# AGENCY_ABBREVIATION: This is the deploying agencies identified abbreviation 
# APPLICATION_RESOURCE_GROUP_NAME: This is the agncies Azure resource group where the application is deployed
# APPLICATION_NAME: This is the name of the deployed application (ripa)
# APPLICATION_UI_SA_NAME: This is the name os the UI storage account where the application is deployed (ripasdsduisa)
# CSSA_CERT_KEY_VAULT_RG: This is the resource group where the CSSA wildcard certificate is stored (sdsd-gen-p-rg)
# CSSA_CERT_KEY_VAULT_NAME: This is the name of hte key vault where the CSSA wildcard certificate is stored (sdsd-gen-p-kv)
# CSSA_CERT_SECRET_NAME: This is the name of the secret where the CSSA wildcard certificate is stored (star-cssa-cloud)
# CSSA_CERT_SECRET_VERSION: This identifies the version of the certificate secret to use (Latest)
# APP_DOMAIN_TYPE: This identifies the type of domain the user chose during deployment (private_domain or cssa_cloud_domain)

# These settings are only used when the user select private/custom domain
# CUSTOM_PRIMARY_DOMAIN: This is the primary domain name if the user chose private/custom domain (sample.gov)
# CUSTOM_APP_CNAME_ALIAS: This is the application alias the user chose whe using private/custom domain
# CUSTOM_CERT_KEY_VAULT_RID: This is the resource id (RID) of the key vault that holds the private/custom certificate (/subscriptions/{subscriptionId}/resourceGroups/{rg}/providers/Microsoft.KeyVault/vaults/{keyVaultName})
# CUSTOM_CERT_SECRET_NAME: This is the secret name of the private/custom certififcate

dns_sub_domain_name=$APPLICATION_NAME-$AGENCY_ABBREVIATION

# If user chose private/custom domain we must remap the correct values provided from MP UI
if [ $APP_DOMAIN_TYPE == 'private_domain' ]
then
    echo "Using private domain configuration"

    CSSA_DNS_ROOT_ZONE=$CUSTOM_PRIMARY_DOMAIN
    APPLICATION_NAME=$CUSTOM_PRIMARY_DOMAIN

    RID=$CUSTOM_CERT_KEY_VAULT_RID
    parts=(${RID//// })
    CSSA_CERT_KEY_VAULT_RG=${parts[3]}
    CSSA_CERT_KEY_VAULT_NAME=${parts[7]}
    CSSA_CERT_SECRET_NAME=$CUSTOM_CERT_SECRET_NAME

    dns_sub_domain_name=$CUSTOM_APP_CNAME_ALIAS
fi

echo "CLOUD_TYPE: " $CLOUD_TYPE
echo "CSSA_TENANT_ID: " $CSSA_TENANT_ID
echo "CSSA_SP_APP_ID: " $CSSA_SP_APP_ID
echo "CSSA_SUBSCRIPTION_ID: " $CSSA_SUBSCRIPTION_ID
echo "CSSA_RESOURCE_GROUP_NAME: " $CSSA_RESOURCE_GROUP_NAME
echo "CSSA_CDN_PROFILE_NAME: " $CSSA_CDN_PROFILE_NAME
echo "CSSA_DNS_ROOT_ZONE: " $CSSA_DNS_ROOT_ZONE
echo "AGENCY_ORI: " $AGENCY_ORI
echo "AGENCY_ABBREVIATION: " $AGENCY_ABBREVIATION
echo "APPLICATION_RESOURCE_GROUP_NAME: " $APPLICATION_RESOURCE_GROUP_NAME
echo "APPLICATION_NAME: " $APPLICATION_NAME
echo "APPLICATION_UI_SA_NAME: " $APPLICATION_UI_SA_NAME
echo "CSSA_CERT_KEY_VAULT_RG: " $CSSA_CERT_KEY_VAULT_RG
echo "CSSA_CERT_KEY_VAULT_NAME: " $CSSA_CERT_KEY_VAULT_NAME
echo "CSSA_CERT_SECRET_NAME: " $CSSA_CERT_SECRET_NAME
echo

echo "APP_DOMAIN_TYPE: " $APP_DOMAIN_TYPE
echo "CUSTOM_PRIMARY_DOMAIN: " $CUSTOM_PRIMARY_DOMAIN
echo "CUSTOM_APP_CNAME_ALIAS: " $CUSTOM_APP_CNAME_ALIAS
echo "CUSTOM_CERT_KEY_VAULT_RID: " $CUSTOM_CERT_KEY_VAULT_RID
echo "CUSTOM_CERT_SECRET_NAME: " $CUSTOM_CERT_SECRET_NAME
echo 

echo "Setting Azure cloud:" $CLOUD_TYPE
result=$(az cloud set -n $CLOUD_TYPE)
echo "Logging in with Azure CLI:" $CSSA_TENANT_ID $CSSA_SP_APP_ID
result=$(az login --service-principal --tenant $CSSA_TENANT_ID -u $CSSA_SP_APP_ID -p $CSSA_SP_SECRET)
echo "Setting default subscription:" $CSSA_SUBSCRIPTION_ID
result=$(az account set -s $CSSA_SUBSCRIPTION_ID)
az account show
echo

echo "Configuring storage account static website:" $APPLICATION_RESOURCE_GROUP_NAME"/"$APPLICATION_UI_SA_NAME
result=$(az storage blob service-properties update --account-name $APPLICATION_UI_SA_NAME --index-document index.html --static-website true)
WEB_CONTENT_URL1=$(az storage account show -g $APPLICATION_RESOURCE_GROUP_NAME -n $APPLICATION_UI_SA_NAME --query "primaryEndpoints.web" --output tsv)
echo "WEB_CONTENT_URL1: " $WEB_CONTENT_URL1
WEB_CONTENT_URL2="${WEB_CONTENT_URL1///$''}"
echo "WEB_CONTENT_URL2: " $WEB_CONTENT_URL2
WEB_CONTENT_URL="${WEB_CONTENT_URL2/https:$''}"
echo 
echo "WEB_CONTENT_URL: " $WEB_CONTENT_URL
echo 

dns_host_name=$dns_sub_domain_name.$CSSA_DNS_ROOT_ZONE
endpoint_name=$dns_sub_domain_name"-cdn-ep"

# Default to Gov cloud, change if not
cname_alias=$endpoint_name".azureedge.us"
if [ $CLOUD_TYPE = "AzureCloud" ]
then 
    echo "Using azureedge.net"
    cname_alias=$endpoint_name".azureedge.net"
fi

dns_host_name_name=${dns_host_name//.}
dns_host_name_name=${dns_host_name_name//-}

echo "dns_sub_domain_name: " $dns_sub_domain_name
echo "dns_host_name: " $dns_host_name
echo "endpoint_name: " $endpoint_name
echo "cname_alias: " $cname_alias
echo "dns_host_name_name: " $dns_host_name_name
echo

if [ $APP_DOMAIN_TYPE == 'cssa_cloud_domain' ]
then
    # Create DNS CNAMEs for the application URL and for CDN Verify
    echo "Using CSSA DNS configuration"
    echo "Creating/updating DNS CNAMES"
    result=$(az network dns record-set cname set-record --subscription $CSSA_SUBSCRIPTION_ID -g $CSSA_RESOURCE_GROUP_NAME -z $CSSA_DNS_ROOT_ZONE -n $dns_sub_domain_name -c $cname_alias)
    echo "Created" $cname_alias "record"
    result=$(az network dns record-set cname set-record --subscription $CSSA_SUBSCRIPTION_ID -g $CSSA_RESOURCE_GROUP_NAME -z $CSSA_DNS_ROOT_ZONE -n cdnverify.$dns_sub_domain_name -c cdnverify.$cname_alias)
    echo "Created cdnverify."$cname_alias "record"
    echo
fi

echo "Creating CDN Endpoint" $endpoint_name
 # Force these values to lowercase
ori=${AGENCY_ORI,,}
agency=${AGENCY_ABBREVIATION,,}
# result=$(
az cdn endpoint create \
    --subscription $CSSA_SUBSCRIPTION_ID \
    --resource-group $CSSA_RESOURCE_GROUP_NAME \
    --location "Global" \
    --profile-name $CSSA_CDN_PROFILE_NAME \
    --name $endpoint_name \
    --origin $WEB_CONTENT_URL \
    --origin-host-header $WEB_CONTENT_URL \
    --enable-compression true \
    --no-http false \
    --no-https false \
    --tags ori=$ori agency=$agency application=ripa
    # )

    # Currently, there is an open defect for this parameter
    # https://github.com/Azure/azure-cli/issues/13935 
    #--content-types-to-compress $CompressedContentTypes \
echo "Created:" $endpoint_name
echo

echo "Creating custom domain" $dns_host_name
# result=$(
az cdn custom-domain create \
    --resource-group $CSSA_RESOURCE_GROUP_NAME \
    --profile-name $CSSA_CDN_PROFILE_NAME \
    --endpoint-name $endpoint_name \
    --hostname $dns_host_name \
    --name $dns_host_name_name
    # )
echo "Created:" $dns_host_name
echo

echo "Enabling HTTPS on custom domain" $dns_host_name
# result=$(
az cdn custom-domain enable-https \
    --resource-group $CSSA_RESOURCE_GROUP_NAME \
    --profile-name $CSSA_CDN_PROFILE_NAME \
    --endpoint-name $endpoint_name \
    --name $dns_host_name_name \
    --min-tls-version 1.2 \
    --user-cert-subscription-id $CSSA_SUBSCRIPTION_ID \
    --user-cert-group-name $CSSA_RESOURCE_GROUP_NAME \
    --user-cert-vault-name $CSSA_CERT_KEY_VAULT_NAME \
    --user-cert-secret-name $CSSA_CERT_SECRET_NAME \
    --user-cert-protocol-type 'sni'
    # )
echo "Enabled:" $dns_host_name
echo

echo "Creating HTTP-HTTPS Redirect rule - Ignore onscreen warnings"
# result=$(
az cdn endpoint rule add \
    --resource-group $CSSA_RESOURCE_GROUP_NAME \
    --profile-name $CSSA_CDN_PROFILE_NAME \
    --name $endpoint_name \
    --order 1 \
    --rule-name "HttpRedirect" \
    --match-variable RequestScheme \
    --operator Equal \
    --match-values HTTP \
    --action-name "UrlRedirect" \
    --redirect-protocol Https \
    --redirect-type PermanentRedirect
    # )
echo "Created HTTP-HTTPS redirect rule"
echo

echo "Finished DNS/Custom Host/Certificate deployment"

pause