# Usage
# 
# Azure-Resource-Providers-Registration tenantId  subscriptionId
# Example:
# Azure-Resource-Providers-Registration 00000000-0000-0000-0000-000000000000 00000000-0000-0000-0000-000000000000

az cloud set -n AzureUSGovernment
az login --tenant %1
az account set -s %2

az role assignment create --role Contributor --assignee 5ff48213-da14-4ac7-85fb-a21bb91d8eb3 --subscription %2

az provider register --namespace Microsoft.ADHybridHealthService --accept-terms 
az provider register --namespace Microsoft.Advisor --accept-terms 
az provider register --namespace Microsoft.AlertsManagement --accept-terms 
az provider register --namespace Microsoft.ApiManagement --accept-terms 
az provider register --namespace Microsoft.AppConfiguration --accept-terms 
az provider register --namespace Microsoft.Authorization --accept-terms 
az provider register --namespace Microsoft.Cdn --accept-terms 
az provider register --namespace Microsoft.Compute --accept-terms 
az provider register --namespace Microsoft.ContainerInstance --accept-terms 
az provider register --namespace Microsoft.ContainerRegistry --accept-terms 
az provider register --namespace Microsoft.CostManagement --accept-terms 
az provider register --namespace Microsoft.CostManagementExports --accept-terms 
az provider register --namespace Microsoft.CognitiveServices --accept-terms 
az provider register --namespace Microsoft.DocumentDB --accept-terms 
az provider register --namespace microsoft.insights --accept-terms 
az provider register --namespace Microsoft.KeyVault --accept-terms 
az provider register --namespace Microsoft.ManagedIdentity --accept-terms 
az provider register --namespace Microsoft.MarketplaceOrdering --accept-terms 
az provider register --namespace Microsoft.Network --accept-terms 
az provider register --namespace Microsoft.OperationalInsights --accept-terms 
az provider register --namespace Microsoft.PolicyInsights --accept-terms 
az provider register --namespace Microsoft.ResourceGraph --accept-terms 
az provider register --namespace Microsoft.Resources --accept-terms 
az provider register --namespace Microsoft.SerialConsole --accept-terms 
az provider register --namespace Microsoft.Security --accept-terms 
az provider register --namespace Microsoft.ServiceBus --accept-terms 
az provider register --namespace Microsoft.Storage --accept-terms 
az provider register --namespace Microsoft.Web --accept-terms 