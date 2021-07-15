# RIPA.Functions.Stop

## Azure Functions HttpTriggers for REST API with Azure CosmosDb as a Repository

local.settings.json should include values:

"Account": "https://{yourCosmosInstanceName}.documents.azure.us:443/",

"Key": "{Cosmos Connection Key}",

"DatabaseName": "ripastops",

"ContainerName": "userprofile",

Azure Functions:

DeleteUser/{id}

PutUser/{id}

GetUser/{id}

GetUsers
