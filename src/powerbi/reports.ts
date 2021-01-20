import axios, { AxiosRequestConfig } from "axios";

export const getReportsInGroup = async ({
  accessToken,
  groupId,
}: {
  accessToken: string;
  groupId: string;
}) => {
  const config: AxiosRequestConfig = {
    headers: {
      ContentType: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const reportsUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports`;

  const response = await axios.get(reportsUrl, config);
  return {
    code: response.status,
    message: response.statusText,
    data: response.data.value,
  };
};


// // export const rebindToRelativeReport = async ({
// //   accessToken,
// //   groupId,
// //   originalDatasetId,
// //   newDatasetId
// // }: {
// //   accessToken: string;
// //   groupId: string;
// //   originalDatasetId: string;
// //   newDatasetId: string;
// // }) => {
// }


export const rebindNewDatasetToReport = async ({
  accessToken,
  groupId,
  reportId,
  newDatasetId
}: {
  accessToken: string;
  groupId: string;
  reportId: string;
  newDatasetId: string;
}) => {
  const config: AxiosRequestConfig = {
    headers: {
      ContentType: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const rebindReportUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/Rebind`;

  const rebindArgs = {
      datasetId: newDatasetId
  }
  const response = await axios.post(rebindReportUrl, rebindArgs, config);
  return {
      code: response.status,
      message: response.statusText
  }
};
