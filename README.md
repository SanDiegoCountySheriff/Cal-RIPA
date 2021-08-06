# Cal-RIPA

## User Upload

### Navigation

The User Upload function is used to upload current users from the existing RIPA application. The file must be of type .csv and include the required columns in any order. Navigate to the Administrator Users page and click Upload Users

![UploadUsersButton](UI\src\assets\Images\UploadUserButton.PNG)

### Columns

The Upload Users File Dialog will display the required and optional columns. 'Id' is the GUID used to represent the object ID for the user in Azure Active Directory. 'OfficerId' is the 9-digit officer ID from the existing RIPA application.

![UploadUsersDialog](UI\src\assets\Images\UploadUserDialog.PNG)

Optional column 'Assigment' is the integer 1-10 representing the officer assignment according to RIPA standards. If 'Agency' is included on the .csv file check the box to skip entering the agency name or abbreviation, otherwise enter the agency name or abbreviation in the text field.

### File Format

Below is an example of a basic .csv including only the required columns

![UploadUserMinimumCSV](UI\src\assets\Images\UploadUserMinimumCSV.PNG)

And an example of a complete .csv

![UploadUserMaximumCSV](UI\src\assets\Images\UploadUserMaximumCSV.PNG)
