const { Client } = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const { AuthorizationCodeCredential } = require("@azure/identity");

const credential = new AuthorizationCodeCredential("ff41217d-9ad8-48e2-a6f5-eac6b5de95a3", "ac4e325a-6c4f-408f-b6a9-393f0d84d38e");
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: [scopes],
});
