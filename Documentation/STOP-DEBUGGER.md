# Cal-RIPA

## STOP Data Debugger

RIPA has a hidden gem that lets you see the Json data objects as you progress thru a STOP entry event. You can configure RIPA to display a hidden button at the bottom of the STOP entry form by following the instructions below. Once the debugger has been configured you can find the link/button.

    | ![](./assets/RIPA-STOP-Data-Debugger-01.png) |
    |-

Follow the [application configuration](./APP-CONFIG.md) instruction to edit the config.json file and turn on the STOP Data Debugger.

### What do I see?

The STOP Data Debugger has 2 sections (tabs). The "RIPA STOP" tab shows the json data that is used internally to the UI. This json structure never leaves the UI as it is translated to the "API STOP" json object before being sent to the backend STOP API. The "API STOP" is as it sounds the contract between the user interface and the STOP Azure Function APIs.

### RIPA STOP

| ![RIPA STOP](./assets/RIPA-STOP-Data-Debugger-02.png) |
|-

### API STOP

| ![API STOP](./assets/RIPA-STOP-Data-Debugger-03.png) |
|-
