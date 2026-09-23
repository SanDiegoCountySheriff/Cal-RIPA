# RIPA Deployment Scripts

## Multi-subscription deployment

Use [Deploy-RIPAResourceGroupBatch.ps1](Deploy-RIPAResourceGroupBatch.ps1) to run `az deployment group create` across many subscriptions.

The script always uses `AzureUSGovernment`, service principal authentication, and the `usgovarizona` region.

Upload a CSV file named `targets.csv` with one row per deployment target. The file needs these columns:

| Column              | Required | Description                                                   |
| ------------------- | -------- | ------------------------------------------------------------- |
| `subscriptionId`    | Yes      | Azure subscription ID to switch to before deployment          |
| `resourceGroupName` | Yes      | Resource group to create or deploy into for that subscription |

Example `targets.csv`:

```csv
subscriptionId,resourceGroupName
00000000-0000-0000-0000-000000000001,RIPA-Dev
00000000-0000-0000-0000-000000000002,RIPA-Prod
```

If a resource group does not exist, the script creates it in `usgovarizona`.

```powershell
.\Deploy-RIPAResourceGroupBatch.ps1 `
	-TenantId '00000000-0000-0000-0000-000000000000' `
	-ServicePrincipalAppId '00000000-0000-0000-0000-000000000000' `
	-ServicePrincipalSecret 'replace-me' `
	-TargetMapFile '.\targets.csv' `
	-TemplateFile '..\IaC\Infrastructure\azuredeploy-IaCTemplateGovMod.json' `
	-ParametersFile '..\IaC\Infrastructure\azuredeploy-IacTemplateGovMod.parameters.json'
```

The script runs `az deployment group what-if` before each deployment unless you pass `-SkipWhatIf`.
