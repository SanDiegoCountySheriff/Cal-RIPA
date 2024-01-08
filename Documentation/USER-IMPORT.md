# User Import

## Existing User Profile Import

The California Department of Justice (DoJ) requires that unique officer ids be used when submitting data to the DoJ RIPA system. These ids apply to the user for the entire lifetime of their employment/association at an agency. Hence, once an officer id is submitted to the DoJ it must be maintained and used for that user until they are no longer associated with the organization. If you have previously submitted RIPA related data to the DoJ, you will have to maintain the "OfficerId" of employees who have created, managed or submitted said data. This topic provides instructions on how you can "Import" a list of existing user profiles.

This process is NOT required for new users. New users can simply open the application and create their "User Profile". However, you can use this feature to "Pre-load" all of your agency users if you wish.

### Navigation

The Existing User Profile Import feature can be found on the "Users" screen in the "Admin" section of the application and is used to upload previously existing users from an existing RIPA application. The file must be of type .csv and include the required columns in any order. Navigate to the Administrator Users page and click Upload Users

![UploadUserButton](https://user-images.githubusercontent.com/83732510/128557273-790fd939-dc43-461b-a3c3-2594e4b9c9c7.PNG)

### Columns

The Upload Users File Dialog will display the required and optional columns. 'Id' is the GUID used to represent the object ID for the user in Azure Active Directory. 'OfficerId' is the 9-digit officer ID from the existing RIPA application.

![UploadUserDialog](https://user-images.githubusercontent.com/83732510/128557424-c7da3d9f-7e4a-46c7-9649-478f55838625.PNG)

Optional column 'Assignment' is the integer 1-10 representing the officer assignment according to RIPA standards. If 'Agency' is included on the .csv file check the box to skip entering the agency name or abbreviation, otherwise enter the agency name or abbreviation in the text field.

### File Format

Below is an example of a basic .csv including only the required columns

![UploadUserMinimumCSV](https://user-images.githubusercontent.com/83732510/128557482-6068bd5d-1106-4d43-af78-5f25d9623b92.PNG)

And an example of a complete .csv

![UploadUserMaximumCSV](https://user-images.githubusercontent.com/83732510/128557449-2bfa3263-a6b9-472c-9c5d-e3d51c5c899a.PNG)

## Import from Legacy RIPA

If you are a legacy RIPA agency we are providing a utility to help with exporting and mapping your users from your on-prem Active Directory with your Azure Active Directory (Entra AD).

You can download it here: [User Export Utility](./assets/RIPAUserMigration_exe.zip)

Run it as admin and follow the on-screen instructions. You will need to have access to the old RIPA database and your on-prem Active Directory.
