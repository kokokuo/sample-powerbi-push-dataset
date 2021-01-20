import axios, { AxiosRequestConfig } from "axios";
import { StatusCodes } from "http-status-codes";


export type ReportResult = {
  id: string,
  datasetId: string,
  name: string,
  webUrl: string,
  embedUrl: string,
  isFromPbix: boolean,
  isOwnedByMe: boolean,
  reportType: string,
};

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
    data: response.status === StatusCodes.OK ? response.data.value as Array<ReportResult> : []
  }; 
  
};


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
