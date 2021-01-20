import axios, { AxiosRequestConfig } from "axios";

export type TableColumn = {
  name: string;
  dataType: string;
};

export type TableSchema = {
  name: string;
  columns: TableColumn[];
};

export const createDataset = async ({
  accessToken,
  groupId,
  data,
}: {
  accessToken: string;
  groupId: string;
  data: TableSchema;
}) => {
  const config: AxiosRequestConfig = {
    headers: {
      ContentType: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const datasetInGroupUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets`;
  const createArgs = {
    name: data.name,
    tables: [data],
  };
  // Create Dataset & Table Columns
  const result = await axios.post(datasetInGroupUrl, createArgs, config);
  // Get Dataset Id & TableName
  return {
    code: result.status,
    message: result.statusText,
    datasetId: result.data.id,
    table: result.data.name,
  };
};

export type TableRow = {
  [key: string]: number | string | boolean;
};

export type DataRows = {
  table: string;
  rows: TableRow[];
};

export const addRowToDataset = async ({
  accessToken,
  groupId,
  datasetId,
  data,
}: {
  accessToken: string;
  groupId: string;
  datasetId: string;
  data: DataRows;
}) => {
  const config: AxiosRequestConfig = {
    headers: {
      ContentType: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const datasetInGroupUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets`;
  // Add Initialized Data Row
  const postArgs = {
    rows: data.rows,
  };
  const dataRowInGroupUrl = `${datasetInGroupUrl}/${datasetId}/tables/${data.table}/rows`;
  const result = await axios.post(dataRowInGroupUrl, postArgs, config);
  return {
    code: result.status,
    message: result.statusText,
  };
};

export const deleteDataset = async ({
  accessToken,
  groupId,
  datasetId,
}: {
  accessToken: string;
  groupId: string;
  datasetId: string;
}) => {
  const config: AxiosRequestConfig = {
    headers: {
      ContentType: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const datasetInGroupUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets/${datasetId}`;

  // Delete Datasets by specific Table
  const result = await axios.delete(datasetInGroupUrl, config);

  return {
    code: result.status,
    message: result.statusText,
  };
};
