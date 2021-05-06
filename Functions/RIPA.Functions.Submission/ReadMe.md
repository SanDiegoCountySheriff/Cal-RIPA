# RIPA.Functions.Submission

## Azure Functions HttpTriggers for REST API with Azure CosmosDb as a Repository

local.settings.json should include values:
   "Account": "https://{yourCosmosInstanceName}.documents.azure.us:443/",
   "Key": "{Cosmos Connection Key}",
   "DatabaseName": "ripastops",
   "ContainerName": "submission",
   "SftpHost": "m4nkoutun7e4a.westus.azurecontainer.io",
   "SftpPort": 22,
   "SftpUserName": "sftpTestUser",
   "SftpPassword": "test",
   "SftpInputPath": "/upload/input/",
   "SftpOutputPath": "/upload/output/",
   "GetStopUrl": "http://localhost:7072/api/GetStop/{Id}",
   "PutStopUrl": "http://localhost:7072/api/PutStop/{Id}",
   "RipaStorage": "{RIPA storage connection string}",
   "ContainerPrefix": "results",
    

Azure Functions: 
	DeleteSubmission/{id}
	GetSubmission/{id} 
	GetSubmissions
	PostSubmit 
		Body:
			{
				"StopIds": [
					"1"
				]
			}
	TimerGetSubmitResults

### Post Submit
	Gets each Stop and converts to DOJ Stop, streams json file to Azure Storage in SubmissionID Direcory. Then streams stop to SFTP upload to DOJ input folder. The Stop is then put with a sumbission object with status of submitted, submission id, and dateSubmitted

### Timer Get Submit Results
	Downloads the Results from DOJ and processes Errors reported. Each stop that was reported as error, submission object is updated, and the stop is put with that status and error report. 

