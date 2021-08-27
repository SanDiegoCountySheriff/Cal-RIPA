# RIPA Application Configuration File

## How to locate and edit the config.json file

1. Open the US Government portal [https://portal.azure.us](https://portal.azure.us)
2. Navigate to the Resource Group where you installed RIPA
3. Search for the storage account that ends with the characters “uisa”

| ![Step 1](/Documentation/assets/RIPA-App-Config-Step-01.png) |
|-

4. Select that storage account
5. Select “Containers” from the left-hand Blades

| ![Step 2](/Documentation/assets/RIPA-App-Config-Step-02.png) |
|-

6. Select the “$web” container

| ![Step 3](/Documentation/assets/RIPA-App-Config-Step-03.png) |
|-

7. Select the “config.json” file

| ![Step 4](/Documentation/assets/RIPA-App-Config-Step-04.png) |
|-

8. Select the “Edit” button

| ![Step 5](/Documentation/assets/RIPA-App-Config-Step-05.png) |
|-

9. Modify the file as desired and click “Save” at the top of the screen

## Application Configuration File Layout

### The config.json file found in the root folder of the UI content container must meet these criteria & layout

    {
    "Authentication": {
        "ClientId": "{Application (Client) ID in GUID format}",
        "AuthorityUrl": "https://login.microsoftonline.com/{Azure Tenant ID in GUID format}",
        "TenantId": "{Azure Tenant ID in GUID format}",
        "PrimaryDomain": "{Your agencies Fully Qualified Domain Name, example myagency.gov}"
    },
    "Configuration": {
        "Environment": "{DEV, QA or PROD}",
        "ServicesBaseUrl": "{Base URI to your APIM instance}",
        "Subscription": "{Your APIM subscription key}",
        "DefaultCounty": "{The county in which your agency has jurisdiction}",
        "DisplayBeatsInput": "{true or false}",
        "DisplayDebugger": "{true or false}"
    },
    "AgencyQuestions": [ // An array of extra questions to be presented in the STOP form
            {
            "Name": "{A simple nae for identifying this question}",
            "Type": "{Currently only supports 'Text'}",
            "Prompt": "{The prompting question you wish the user to answer}",
            "Hint": "{A tool tip displayed when hovered}",
            "MaxLength": 250,
            "Required": {true or false}
            }
        ]
    }
