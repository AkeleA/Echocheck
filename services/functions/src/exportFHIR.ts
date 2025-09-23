import { app, InvocationContext } from "@azure/functions";

export async function exportFhirHandler(
  message: unknown,
  context: InvocationContext
): Promise<void> {
  context.log("exportFhir item", message);
  // TODO: Build FHIR bundle & store
}

app.storageQueue("exportFhir", {
  queueName: "export-fhir", // ensure this queue exists or is created by your storage account
  connection: "AzureWebJobsStorage", // reads from local.settings.json
  handler: exportFhirHandler,
});
