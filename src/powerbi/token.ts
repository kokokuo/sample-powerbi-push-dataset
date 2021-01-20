import { AuthenticationContext, TokenResponse, ErrorResponse } from "adal-node";


// The Application Key for accessing Power BI Rest API
const appClientId = "eab21c7c-1e11-41fc-8f80-1b2fa9a030e1";
const appClientSecret = "rQ9lZEMyuyq_TjQUVd~0NEtY09T_~~4J.7";
const appTenantId = "9c8d1213-d4a1-41cd-bf75-161bf1d76ab6";


const authorityUri = `https://login.microsoftonline.com/${appTenantId}/`;
const scope = "https://analysis.windows.net/powerbi/api";


export const getAuthToken = async () => {
    return new Promise<TokenResponse | ErrorResponse>((resolve, reject) => {
        const authContext = new AuthenticationContext(authorityUri);
        authContext.acquireTokenWithClientCredentials(scope, appClientId, appClientSecret, (err, response) => {
            // Function returns error object in tokenResponse
            // Invalid Username will return empty tokenResponse, thus err is used
            if (err) {
                reject(response == null ? err : response);
            }
            resolve(response);
        })
    });
};
