# DOJ 2024 Regulation Testing

CA DoJ is requiring every agency to submit a set of test stops to verify that they are compliant with the changes that take effect on 01/01/2024.

We have provided Templates to facilitate and speed up testing for you. You should create the test stops before you have users create real stops. You will notice that not every test case results in an actual stop in this system. This is due to business logic that validates the stop entry. You will only have to submit 13 stops as part of this test.

To submit your test stops to DOJ you need to configure the SFTP connection to point to the DoJ Test SFTP site ([DOJ SFTP Configuration](./DOJ-CONFIGURATION.md)).

`Important`: Once you are finished with testing, remove the templates from your production system.

1. First download the templates file here [DoJ Test Case Templates](./assets/TestCaseTemplates.csv)
1. Then upload them to your system using these instructions [Template Upload Instructions](./assets/Ripa%20Template%20Upload%20Instructions.pdf)
1. Follow “Test Case Instructions.pdf” [DoJ Testing Instructions](./assets/Test%20Case%20Instructions.pdf)
   1. Annotate the “2024 Amended Regulation Test Cases.xlsx” [DoJ Testing Instructions Spreadsheet](./assets/2024%20Amended%20Regulation%20Test%20Cases.xlsx)
   1. Email the completed spreadsheet to DOJ after you submit your stops via SFTP.
