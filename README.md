# Cal-RIPA

## User Upload

### Navigation

The User Upload function is used to upload current users from the existing RIPA application. The file must be of type .csv and include the required columns in any order. Navigate to the Administrator Users page and click Upload Users

![UploadUserButton](https://user-images.githubusercontent.com/83732510/128557273-790fd939-dc43-461b-a3c3-2594e4b9c9c7.PNG)

### Columns

The Upload Users File Dialog will display the required and optional columns. 'Id' is the GUID used to represent the object ID for the user in Azure Active Directory. 'OfficerId' is the 9-digit officer ID from the existing RIPA application.

![UploadUserDialog](https://user-images.githubusercontent.com/83732510/128557424-c7da3d9f-7e4a-46c7-9649-478f55838625.PNG)

Optional column 'Assigment' is the integer 1-10 representing the officer assignment according to RIPA standards. If 'Agency' is included on the .csv file check the box to skip entering the agency name or abbreviation, otherwise enter the agency name or abbreviation in the text field.

### File Format

Below is an example of a basic .csv including only the required columns

![UploadUserMinimumCSV](https://user-images.githubusercontent.com/83732510/128557482-6068bd5d-1106-4d43-af78-5f25d9623b92.PNG)

And an example of a complete .csv

![UploadUserMaximumCSV](https://user-images.githubusercontent.com/83732510/128557449-2bfa3263-a6b9-472c-9c5d-e3d51c5c899a.PNG)

