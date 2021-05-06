# RIPA.Functions.TextAnalyics

## Azure Functions HttpTriggers for REST API with Azure Text Analytics for Entity and PII auditing

local.settings.json should include values:
    "TextAnalyticsKey": "{Text Analytics Connection Key}",
    "TextAnalyticsEndpoint": "https://{YourTextAnalyticsName}.cognitiveservices.azure.com/"


Azure Functions: 
	PostCheckPii
        Body: 
            {
                "Document":"James was at his appartment on 411 west elm street and he provided me his ssn 098-123-1234."
            }
    PostCheckPiiBeta
        Body: 
            {
                "Document":"James was at his appartment on 411 west elm street and he provided me his ssn 098-123-1234."
            }
 
## PostCheckPII
takes document as input and returns array of Entities with confidence score and a redacted string excluding entities found with confidence score greater than 75%.
