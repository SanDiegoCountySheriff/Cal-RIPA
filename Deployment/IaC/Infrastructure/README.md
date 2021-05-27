# RIPA Infrastructure as Code
The following resources will be created on Azure public cloud by running "azuredeploy-IaCTemplate.json" template. 
- Application Insights
- API Management service
- Azure Cosmos DB account
- Function App's for userprofile,domain,stop,submission and textanalytics
- App Service plan for userprofile,domain,stop,submission and textanalytics
- Key vault
- Log Analytics workspace
- Text Analytics
- Virtual network
- Private endpoint
- Network interface
- Storage account's 
- Network security group for cosmosdb and API management.

The following resources will be created on Azure Government cloud by running "azuredeploy-IaCTemplateGovMod.json" template.
- Application Insights
- API Management service
- Azure Cosmos DB account
- Function App's for userprofile,domain,stop,submission and textanalytics
- App Service plan for userprofile,domain,stop,submission and textanalytics
- Key vault
- Log Analytics workspace
- Text Analytics
- Virtual network
- Private endpoint
- Network interface
- Storage account's 
- Network security group for cosmosdb and API management.

#### Deploying infrastructure through ArmTemplate

To deploy ArmTemplate via the command line (using the Azure CLI ) you can use the commands below.

###### To Create ResourceGroup

```
az group create --name <resourcegroupName> --location <location>
```

###### To deploy template 

```
az deployment group create --resource-group <resourcegroupName> --name <deploymentName> --template-file <templateFile>
```
###### To deploy template with parameters file

```
az deployment group create --resource-group <resourcegroupName> --name <deploymentName> --template-file <templateFile> --parameters <parameterFile>
```
