# CLEW Data List Maintenance

Updating list data from Cal DOJ has never been easier. The spreadsheet that contains City, School and Offense Code lists is publicly available on the DOJ website.

Look for the link labeled "RIPA - Stop Data Collection System" to download the .xlsx format file.

https://oag.ca.gov/law/code-tables

Log into your instance of RIPA with an Admin account and follow these steps:

1. Click Domains Tab
1. Click "Upload CLEW Data" button
1. Click the "Upload CLEW file" field
1. Select the file you downloaded from DoJ
1. Click Save

If you use Beats, you can also include a tab with Beat data in the upload file:

A sheet named 'Beat_Table' may be added to include your agency's beats with the following columns in this exact order.

Required Columns:

'Id'
'Community'
'Command'
'CommandAuditGroup'
'CommandAuditSize'
