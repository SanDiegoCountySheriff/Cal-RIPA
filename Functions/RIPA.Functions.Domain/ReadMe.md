# RIPA.Functions.Domain

## Azure Functions HttpTriggers for REST API with Azure Storage as a Repository

This Azure Function project is key use is to query and manage the RIPA domain data. 
Domain Data Types:
	Beats
	Cities
	Schools
	Statutes
	Templates

local.settings.json should include Value "RipaStorage": "Azure Storage Connection String"

Azure Functions use Table Entity in Azure Storage

Each Domain generally has Delete, Get (list all), and Put endpoints

## Uploading Data using the PostUpload endpoint and .xlsx

Note that and Upload will not truncate the storage tables. These datasets are updated with the uploaded data. 
If Deletion is required, utilize the delete endpoints. 

Post Body should include form-data with KEY = "file" and VALUE = "{YourFileNameHere}.xlsx"
The .xlsx should contain the follow worksheets with exact naming:
	City_Table
	School_Table
	Offense_Table
	Beat_Table

### City_Table
Columns:
	State, City, Count, Inactive Date

### School_Table
Columns:
	CDS_Code, Status, County, Districs, SchoolName

### Offense_Table
Columns:
	Offense Validation CD, Offense Code, Offense Txn Type CD, Offense Statute, Offense Type of Statute CD, Statute Literal 25, Offense Default Type of Charge, Offense Type of Charge, Offense Literal Identifier CD, Offense Degree, BCS Hierarchy CD, Offense Enacted, Offense Repealed, ALPS Cognizant CD

### Beat_Table
Columns:
	Beat, Community, Command, CommandAuditGroup, CommandAuditSize