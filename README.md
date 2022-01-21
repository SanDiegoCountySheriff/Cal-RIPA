# Cal-RIPA

## By CSSA & Insight Digital Innovation

The CSSA RIPA Azure Marketplace offering is a cost effective, turnkey option for close to 700 law enforcement agencies in the State of California to effectively and transparently comply with the California Racial and Identity Profiling Act of 2015 (RIPA).

RIPA requires all state and local law enforcement agencies to collect data regarding stops of individuals, including perceived demographic information on persons stopped, and to report this data to the California Attorney General's Office. Every agency in California must comply by January 1st 2022.

The CSSA RIPA application is a complete solution to comply with this mandate. It’s a Progressive Web App (PWA) built for device agnostic data collection and has many features that are designed to optimize the user experience such as address lookups, favorites for frequent selections, and PII detection based on Azure Cognitive Services leveraging Artificial Intelligence (AI). Agencies will also have precise insight into how much time their users are spending in the app.

A rich set of built-in administrative features includes data submission functionality to the California Department of Justice. Agencies can conduct PII redaction and post-submission error correction directly in the application, with the reassurance of changes captured in an audit table.

This cloud-native solution is designed to run on serverless Azure Government cloud infrastructure with scalability, modern security, and the ability to integrate with modern analytics platforms. The maintenance burden is minimized because Agencies don't need to maintain on-site or even cloud hosted servers and the application can be available anywhere their users are without the need for mobile device management solutions. Code updates will be centrally managed and distributed.

## Features

1. Open source community project that can be extended and maintained by the law enforcement community at large
2. Simple installation via Azure Marketplace (Contact CSSA to get installation instructions)
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
11. Preloaded domain lists provided by the DoJ
    1. Cities
    2. Schools
    3. Statutes
12. Agency Beat collection (optional)
13. Domain list maintenance screens
14. User maintenance screens
15. STOP maintenance screens
16. DoJ Submission maintenance screens
17. Officers last 10 STOPs screens
18. User profile maintenance screens
19. Various "Favorites" that allow for rapid selection of items each user uses the most
20. Ability to create and maintain additional agency specific questions that go beyond the AB#953 requirements
21. Ability to create and maintain predefined STOP templates
    1. These are JSON documents with a set of predetermined answers to help speed the data entry process for specific scenarios like traffic or probation related events
22. Links to the RIPA statutes in specific sections of the STOP screens
23. PII detection using Azure Cognitive Services
24. GEO location detection for ease of location entry
25. A debugger option that displays the internal details of a STOP record to help the agency find issues when required
26. CSSA integrated domain names & certificates
    1. Or you can provide your own DNS & Certificate (BYOC)

## How do I?

In this section you will find links & tips to help you get the most out of your RIPA deployment(s)

1. [Installation](./Documentation/INSTALLATION.md)
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
