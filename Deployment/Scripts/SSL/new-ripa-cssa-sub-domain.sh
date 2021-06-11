# Creates DNS  CDN Endpoints and configures custom DNS for cssa.cloud based URLs
echo
echo

echo "Starting DNS/Custom Host/Certificate deployment"
echo

SP_APP_ID="2ccdc073-be01-4c42-aef1-0da694c3be0b"
SP_SECRET="kUpHQs2r7Hs~vxA.v1l0a8J2gKAZsJa89s"
TENANT_ID="6ab62649-cbe9-460c-b26f-ff063ee0d392"
SUBSCRIPTION="1340e16e-8c9e-44b7-9b12-78ed3c74211b"
RESOURCE_GROUP_NAME="shared-keep-rg"
CDN_PROFILE_NAME="lesmcwhirter-me-cdn"
DNS_ROOT_ZONE="lesmcwhirter.me"
AGENCY_ABBREVIATION="sandiego"
APPLICATION_NAME="ripa2"
KEY_VAULT_NAME="shared-keep-kv"
SECRET_NAME="star-lesmcwhirter-me"
SECRET_VERION=Latest 
WEB_CONTENT_URL="ripacdntestwebsa.z13.web.core.windows.net"

echo "SP_APP_ID: " $SP_APP_ID
echo "SP_SECRET: ******"
echo "TENANT_ID: " $TENANT_ID
echo "SUBSCRIPTION: " $SUBSCRIPTION
echo "RESOURCE_GROUP_NAME: " $RESOURCE_GROUP_NAME
echo "CDN_PROFILE_NAME: " $CDN_PROFILE_NAME
echo "DNS_ROOT_ZONE: " $DNS_ROOT_ZONE
echo "AGENCY_ABBREVIATION: " $AGENCY_ABBREVIATION
echo "APPLICATION_NAME: " $APPLICATION_NAME
echo "KEY_VAULT_NAME: " $KEY_VAULT_NAME
echo "SECRET_NAME: " $SECRET_NAME
echo "WEB_CONTENT_URL: " $WEB_CONTENT_URL
echo

dns_sub_domain_name=$APPLICATION_NAME-$AGENCY_ABBREVIATION
dns_host_name=$dns_sub_domain_name.$DNS_ROOT_ZONE
endpoint_name=$dns_sub_domain_name"cssa-cdn-ep"
cname=$endpoint_name".azureedge.net"
dns_host_name_name=${dns_host_name//.}
dns_host_name_name=${dns_host_name_name//-}

echo "dns_sub_domain_name: " $dns_sub_domain_name
echo "dns_host_name: " $dns_host_name
echo "endpoint_name: " $endpoint_name
echo "cname: " $cname
echo "dns_host_name_name: " $dns_host_name_name
echo

echo "Logging into Azure CLI"
result=$(az login --service-principal -u http://docker-deployments-sp -p $SP_SECRET --tenant $TENANT_ID
echo

echo "Setting default subscription"
az account set -s 1340e16e-8c9e-44b7-9b12-78ed3c74211b
az account show
echo

# Create DNS CNAMEs for the application URL and for CDN Verify
echo "Creating/updating DNS CNAMES"
result=$(az network dns record-set cname set-record --subscription $SUBSCRIPTION -g $RESOURCE_GROUP_NAME -z $DNS_ROOT_ZONE -n $dns_sub_domain_name -c $cname)
echo "Created" $cname "record"
result=$(az network dns record-set cname set-record --subscription $SUBSCRIPTION -g $RESOURCE_GROUP_NAME -z $DNS_ROOT_ZONE -n cdnverify.$dns_sub_domain_name -c cdnverify.$cname)
echo "Created cdnverify."$cname "record"
echo

echo "Creating CDN Endpoint" $endpoint_name
result=$(az cdn endpoint create \
    --resource-group $RESOURCE_GROUP_NAME \
    --location "Global" \
    --profile-name $CDN_PROFILE_NAME \
    --name $endpoint_name \
    --origin $WEB_CONTENT_URL \
    --origin-host-header $WEB_CONTENT_URL \
    --enable-compression true \
    --no-http false \
    --no-https false \
    --tags agency=$AGENCY_ABBREVIATION application=$APPLICATION_NAME)

    # Currently, there is an open defect for this parameter
    # https://github.com/Azure/azure-cli/issues/13935 
    #--content-types-to-compress $CompressedContentTypes \
echo

echo "Creating custom domain" $dns_host_name
result=$(az cdn custom-domain create \
    --resource-group $RESOURCE_GROUP_NAME \
    --profile-name $CDN_PROFILE_NAME \
    --endpoint-name $endpoint_name \
    --hostname $dns_host_name \
    --name $dns_host_name_name)
echo

echo "Enabling HTTPS on custom domain" $dns_host_name
result=$(az cdn custom-domain enable-https \
    --resource-group $RESOURCE_GROUP_NAME \
    --profile-name $CDN_PROFILE_NAME \
    --endpoint-name $endpoint_name \
    --name $dns_host_name_name \
    --min-tls-version 1.2 \
    --user-cert-subscription-id $SUBSCRIPTION \
    --user-cert-group-name $RESOURCE_GROUP_NAME \
    --user-cert-vault-name $KEY_VAULT_NAME \
    --user-cert-secret-name $SECRET_NAME \
    --user-cert-protocol-type 'sni')
echo

echo "Creating HTTP Redirect rule - *** Ignore onscreen warnings ***"
result=$(az cdn endpoint rule add \
    --resource-group $RESOURCE_GROUP_NAME \
    --profile-name $CDN_PROFILE_NAME \
    --name $endpoint_name \
    --order 1 \
    --rule-name "HttpRedirect" \
    --match-variable RequestScheme \
    --operator Equal \
    --match-values HTTP \
    --action-name "UrlRedirect" \
    --redirect-protocol Https \
    --redirect-type PermanentRedirect)
echo

echo "Finished DNS/Custom Host/Certificate deployment"

echo
echo
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Sleeping 5 seconds"
sleep 5
echo "Shutting down..."
az container delete --subscription $SUBSCRIPTION --resource-group $RESOURCE_GROUP_NAME --name cssa-subdomain-onetime-run-delete-ifucme-ci --yes
echo "Delete command has finished..."
