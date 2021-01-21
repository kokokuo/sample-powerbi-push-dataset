import { AuthenticationContext, TokenResponse, ErrorResponse } from "adal-node";


export const getAuthToken = async ({
  clientId,
  clientSecret,
  tenantId,
}: {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}) => {
  return new Promise<TokenResponse | ErrorResponse>((resolve, reject) => {
    const authorityUri = `https://login.microsoftonline.com/${tenantId}/`;
    const scope = "https://analysis.windows.net/powerbi/api";

    const authContext = new AuthenticationContext(authorityUri);
    authContext.acquireTokenWithClientCredentials(
      scope,
      clientId,
      clientSecret,
      (err, response) => {
        // Function returns error object in tokenResponse
        // Invalid Username will return empty tokenResponse, thus err is used
        if (err) {
          reject(response == null ? err : response);
        }
        resolve(response);
      }
    );
  });
};
