https://github.com/SanDiegoCountySheriff/Cal-RIPA/assets/92050616/8a9f870f-8973-49fb-9f28-825f78f28315

# Cal-RIPA

## By CSSA & Insight Digital Innovation

The CSSA RIPA Azure Marketplace offering is a cost effective, turnkey option for close to 700 law enforcement agencies in the State of California to effectively and transparently comply with the California Racial and Identity Profiling Act of 2015 (RIPA).

RIPA requires all state and local law enforcement agencies to collect data regarding stops of individuals, including perceived demographic information on persons stopped, and to report this data to the California Attorney General's Office. Every agency in California must comply by January 1st 2022.

The CSSA RIPA application is a complete solution to comply with this mandate. It’s a Progressive Web App (PWA) built for device agnostic data collection and has many features that are designed to optimize the user experience such as address lookups, favorites for frequent selections, and PII detection based on Azure Cognitive Services leveraging Artificial Intelligence (AI). Agencies will also have precise insight into how much time their users are spending in the app.

A rich set of built-in administrative features includes data submission functionality to the California Department of Justice. Agencies can conduct PII redaction and post-submission error correction directly in the application, with the reassurance of changes captured in an audit table.

This cloud-native solution is designed to run on serverless Azure Government cloud infrastructure with scalability, modern security, and the ability to integrate with modern analytics platforms. The maintenance burden is minimized because Agencies don't need to maintain on-site or even cloud hosted servers and the application can be available anywhere their users are without the need for mobile device management solutions. Code updates will be centrally managed and distributed.

## Features

1. Open source community project that can be extended and maintained by the law enforcement community at large
2. Simple installation via Azure Marketplace
   1. Can be manually installed and maintained using Azure ARM templates and Azure DevOps if desired
3. Cloud First design using Azure services like Azure Active Directory (AAD), Key Vault, Functions, API Management, Cosmos database and Azure Cognitive Services
4. Automated deployments from centralized Azure Dev Ops under the CSSA Azure Tenant
5. Single Sign On (SSO) with AAD of your choice
6. Fully integrated with California Department of Justice (DoJ) via sFTP connection that is specific for your agency
7. Lightweight Javascript User Interface that implements PWA for local installation
8. Responsive design that adjusts to fit almost any device type or size
9. Light and Dark display modes to adjust to various environmental scenarios
10. Offline operation for STOP entry
    1. Users can create and capture STOP events even when internet/networking is not available
    2. The system implements offline functionality by storing all critical data in local browser storage
    3. The application automatically synchronizes the data the to cloud as soon as it is reconnected to the internet
11. Agency Beat collection (optional)
12. Domain list maintenance screens
13. User maintenance screens
14. STOP maintenance screens
15. DoJ Submission maintenance screens
16. Officers last 10 STOPs screens
17. User profile maintenance screens
18. Various "Favorites" that allow for rapid selection of items each user uses the most
19. Ability to create and maintain additional agency specific questions that go beyond the AB#953 requirements
20. Ability to create and maintain predefined STOP templates
    1. These are JSON documents with a set of predetermined answers to help speed the data entry process for specific scenarios like traffic or probation related events
21. Links to the RIPA statutes in specific sections of the STOP screens
22. PII detection using Azure Cognitive Services
23. GEO location detection for ease of location entry
24. A debugger option that displays the internal details of a STOP record to help the agency find issues when required
25. CSSA integrated domain names & certificates
    1. Or you can provide your own DNS & Certificate (BYOC)

## Installing and configuring your RIPA application instance

### Required steps

1. Set up Authentication

   - First you should follow the [Create Authentication Scheme instructions](./Documentation/AUTHENTICATION.md) to create an Azure Active Directory OAuth/OpenID-Connect App Registration, Admin & User groups and the associated Roles.

2. Deploy App

   - Then go to the Azure US Government portal to install RIPA from your "Private" Marketplace offering. You can find detailed instruction here: [Azure Private Marketplace](./Documentation/MARKETPLACE.md)

3. Import CLEW Data

   - Once the app is deployed and can be logged into, it's time to set up the lookup lists for Schools, Cities and Offense Codes. Follow the [Domain Lists](./Documentation/DOMAIN-LISTS.md) instructions to import lookup lists.

4. Import Existing Users

   - Before users log in, you must import all existing RIPA users at your agency into the system if you are setting up a production environment. Go to [User Import](./Documentation/USER-IMPORT.md) for instructions about how to import existing RIPA users.

5. Set up sFTP credentials with DoJ

   - Before you submit stops from your system to CA DoJ you will have to get credentials. Go to [DoJ Configuration](./Documentation/DOJ-CONFIGURATION.md) for detailed instruction about how to set up your connection to the DoJ sFTP site.

6. Add users to AAD Groups
   - Add users to "RIPA-USERS" and/or "RIPA-ADMINS" groups in your Azure AD tenant. You may have used different group names when setting up. If you have existing user groups that you would rather use, you can do this mapping in the Azure AD Enterprise App Users and Groups setting. Note that group nesting is not supported.

### Optional steps

- Set up Beats: Follow the [Domain Lists](./Documentation/DOMAIN-LISTS.md) instructions as well as [Beats](./Documentation/BEATS.md.md)
- Set up Agency Questions: [Agency Questions](./Documentation/DOJ-CONFIGURATION.md)
- Set up Templates: [Templates](./Documentation/STOP-TEMPLATES.md). There is additional information about 2024 regulation testing templates here: [2024 Templates](./Documentation/2024-REGULATION-UPDATE-DOJ-TESTING.md)

## How do I?

In this section you will find links & tips to help you get the most out of your RIPA deployment(s)

2. [Marketplace](./Documentation/MARKETPLACE.md)
3. [Application Architecture](/Documentation/ARCHITECTURE.md)
4. [Authentication](/Documentation/AUTHENTICATION.md)
5. [Application Configuration](./Documentation/APP-CONFIG.md)
6. [DoJ sFTP interface configuration](/Documentation/DOJ-CONFIGURATION.md)
7. [Domain list maintenance](/Documentation/DOMAIN-LISTS.md)
8. [Import existing users](/Documentation/USER-IMPORT.md)
9. [Turn on/off Beats](/Documentation/BEATS.md)
10. [Agency custom questions](/Documentation/AGENCY-QUESTIONS.md)
11. [Turn STOP debugger on/off](/Documentation/STOP-DEBUGGER.md)
12. [Override default PII detection settings](/Documentation/PII-CONFIGURATION.md)
13. [Application "Environment"](/Documentation/APP-ENVIRONMENT.md)
14. [Custom STOP templates](/Documentation/STOP-TEMPLATES.md)
15. [Custom Domain Setup](/Documentation/CUSTOM-DOMAIN-SETUP.md)

## How to Use the App

In this section, you will find a walkthrough video on how to use the RIPA application.

https://github.com/SanDiegoCountySheriff/Cal-RIPA/assets/92050616/9d4174d3-bee7-4a39-8a09-f9d47c84e48f
