# RIPA.Functions.Stop

## Azure Functions HttpTriggers for REST API with Azure CosmosDb as a Repository

local.settings.json should include values:
   "Account": "https://{yourCosmosInstanceName}.documents.azure.us:443/",
   "Key": "{Cosmos Connection Key}",
   "DatabaseName": "ripastops",
   "ContainerName": "stop",
   "ORI": "{Agency ORI}"


Azure Functions: 
	DeleteStop/{id}
	PutStop/{id}
	GetStop/{id} 
	GetStops?
		StartDate:03/01/2021
		EndDate:4/30/2021
		IsSubmitted:True
		IsError:True
		SubmissionId:800d971a-60b0-489d-9980-355a56581ded

GetStops allows for query of stops with query string params. Utlizes Cosmos SQL to build a sql query to be executed against the container. 