# Sample Power BI Push Dataset

This a sample code for using [Power BI Rest API](https://docs.microsoft.com/en-us/rest/api/power-bi/) to implement Power BI push datasets feature through [Service Principal](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal) authentication method.

# Background for using Power BI Rest API

In order to access Power BI Rest API, we need these steps:

## 1 Choose Embed Solution and authentication method.
Here we use **Embed for your customers solution** and **Service principal** method to authenticate our application.

#### Embed for your customers
The **Embed for your customers** solution is that you're planning to create an application that's designed for your customers, because the data will be provide by application for customer, it also called *app owns data* solution. 

Users will not need to sign in to Power BI or have a Power BI license, to use your application. Therefore, your application could use one of the following methods to authenticate against Power BI:

* Master user account (a Power BI Pro license used for signing in to Power BI)
* [Service principal](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal)

The embed for your customers solution is usually used by independent software vendors (ISVs) and developers who are creating applications for a third party.

#### Embed for your organization

The **Embed for your organization** solution is that you're planning to create an application that **requires users to use their credentials** to authenticate against Power BI. because the data will be provide by user, it also called *user owns data* solution.

The embed for your organization solution is usually used by enterprises and big organizations, and is intended for internal users.

<br/>

### 2 Register an Azure AD application (Manual registration)
In order to use Service principal, we need use the Azure AD manual app registration:

1. Log into Microsoft Azure and search for **App registrations (應用程式註冊)** and click it.
2. Click **New registration**.
<p align="center">
  <img src="/docs/azure-application-registration.png?raw=true" width="640px">
</p>


3. Fill in the required information and click Register.
* Name - Enter a name for your application
* Supported account types - Select supported account types
* (Optional) Redirect URI - Enter a URI if needed
<p align="center">
  <img src="/docs/azure-create-application.png?raw=true" width="640px">
</p>


4.After registering, the Application ID is available from the Overview tab. Copy and save the `Application ID` & `Tenant ID` for later use.

<p align="center">
  <img src="/docs/azure-application-created.png?raw=true" width="640px">
</p>


5.Click the **Certificates & secrets** tab and click **New client secret**


<p align="center">
  <img src="/docs/azure-choose-credentials-and-secret.png?raw=true">
</p>



6.In the Add a client secret window, enter a description, specify when you want the client secret to expire (Here Choose **Never**), and click Add.

<p align="center">
  <img src="/docs/azure-create-secret-choose-never.png?raw=true" width="320px">
</p>

7.Copy and save the `Client secret` value.

<p align="center">
  <img src="/docs/azure-create-application-secret.png?raw=true" width="640px">
</p>

<br/>

### 3 Create an Azure AD security group
Now, service principal doesn't have access to any of your Power BI content and APIs. To give the service principal access, we need to create a **security group** in Azure AD, and **add the service principal** you created to that **security group**.

1.On the Active Directory page, select Groups and then select New group.


<p align="center">
  <img src="/docs/azure-click-ad-service.png?raw=true" width="640px">
</p>

<p align="center">
  <img src="/docs/azure-create-ad-group.png?raw=true" width="640px">
</p>


2.The New Group pane will appear and you must fill out the required information.
Select the group type **Security Group** and type Group Name, then **select our Application** created just now to be the member.

<p align="center">
  <img src="/docs/azure-create-ad-security-group.png?raw=true">
</p>

<br/>

#### 4. Enable the Power BI service admin settings
For an Azure AD app to be able to access the Power BI content and APIs, a Power BI admin needs to enable service principal access in the Power BI admin portal.

<p align="center">
  <img src="/docs/powerbi-enter-administration-portal.png?raw=true" width="320px">
</p>


Add the security group you created in Azure AD, to the specific security group section in the **Developer settings**.

<p align="center">
  <img src="/docs/powerbi-administration-portal-developer-setting-allow-service-principal-powerbi-api.png?raw=true">
</p>

<br/>

#### 5. Add the service principal to your workspace
To enable your Azure AD app access artifacts such as reports, dashboards and datasets in the Power BI service, add the service principal entity, or the security group that includes your service principal, as a member or admin to your workspace.

1.Scroll to the workspace you want to enable access for, and from the More menu, select **Workspace access**.

<p align="center">
  <img src="/docs/powerbi-workspace-access.png?raw=true" width="640px">
</p>


2.In the Access pane, text box, add one of the following:
    - Your service principal. The name of your service principal is the Display name of your Azure AD app, as it appears in your Azure AD app's overview tab.
    - The security group that includes your service principal.

<p align="center">
  <img src="/docs/powerbi-workspace-access-select-service-principal-or-group.png?raw=true" width="480px">
</p>

From the drop-down menu, select **Member** or **Admin**.

3. Select **Add**.

Finish!

## 2. Get an authentication access token (Could ignore if use the sample project)
Now, we could use the `Application ID`, `Client secret` value & `Tenant ID` to authenticate and get access Token for accessing Power BI Rest API.

In this step, we could use the `Application ID`, `Client secret` value & `Tenant ID` before previous step we got, to get an authentication access token.

Because Power BI apps are integrated with Azure Active Directory to provide your app with secure sign in and authorization. Your app need to uses a token to authenticate to Azure AD and gain access to Power BI resources.

In order to use the `Application ID`, `Client secret` value & `Tenant ID` to authenticate, we could install [adal-node](https://www.npmjs.com/package/adal-node) package which is a node.js library for node.js applications to authenticate to Azure AD in order to access Azure AD protected web resources.

```bash
$ yarn add adal-node
```

And here is the sample code.

```typescript
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
    // login url
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

...

app.get("/getAccessToken", async ctx => {
    const tokenInfo = await getAuthToken({
      clientId: "your Application Id",
      clientSecret: "your Application Secret Value",
      tenantId: "your Tenant Id",
    })

    const accessToken = tokenInfo.accessToken;

    // Next Step, access Power BI API....
});
```

## 3. Setup the project's `config.json` file
But the Sample Power BI Push Dataset project has completed the flow of getting access token, so you just need to clone the project and type `Application ID`, `Client secret` value & `Tenant ID` to the `src/config.json` and skip previous step *Get an authentication access token*:

```json
{
    "appClientId": "Type Application ID...",
    "appClientSecret": "Type Client secret...",
    "appTenantId": "Type Tenant ID...",
    "groupId": "Type your group workspace Id"
}
```

You could check the **group workspace Id** from your group workspace URL link:

<p align="center">
  <img src="/docs/powerbi-group-workspace-link.png?raw=true" width="640px">
</p>

It's would be a **UUID** string

After finish setting, then run the server.

# Environment Startup

Please clone the project and type the command to install needed package and run server, the node version which project used is `v10.23.0` and record in th `.nvmrc`.

```bash
$ yarn install
$ yarn run dev # run server
```
