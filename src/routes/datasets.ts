import * as Router from "koa-router";
import { TokenResponse } from "adal-node";
import {
  getAuthToken,
  createDataset,
  addRowToDataset,
  deleteDataset,
  getReportsInGroup,
  rebindNewDatasetToReport,
  ReportResult,
} from "../powerbi";
import { StatusCodes } from "http-status-codes";

export const datasetRouter = new Router();
const groupId = "7bfe2581-d6e3-40e7-8b2f-87544d022b44";

datasetRouter.post("/datasets", async (ctx) => {
  const request = ctx.request.body;

  const result = await getAuthToken();
  if (result.error) {
    ctx.body = {
      error: result.error,
      message: result.errorDescription,
    };
  } else {
    const accessToken = (result as TokenResponse).accessToken;
    const createResult = await createDataset({
      accessToken,
      groupId,
      data: {
        name: request.table,
        columns: request.columns,
      },
    });
    // Add Initialized Data Row
    const addRowResult = await addRowToDataset({
      accessToken,
      groupId,
      datasetId: createResult.datasetId,
      data: {
        table: createResult.table,
        rows: request.rows,
      },
    });

    ctx.body = {
      createDataset: createResult.message,
      addFirstRow: addRowResult.message,
      data: {
        datasetId: createResult.datasetId,
        table: createResult.table,
      },
    };
  }
});

datasetRouter.put("/datasets/:datasetId/tables/:table/rows", async (ctx) => {
  const originalDatasetId = ctx.params.datasetId;
  const originalTable = ctx.params.table;
  const request = ctx.request.body;

  const result = await getAuthToken();
  if (result.error) {
    ctx.body = {
      error: result.error,
      message: result.errorDescription,
    };
  } else {
    const accessToken = (result as TokenResponse).accessToken;

    // Deleted datasets by specific table
    const deleteResult = await deleteDataset({
      accessToken,
      groupId,
      datasetId: originalDatasetId,
    });
    if (deleteResult.code !== StatusCodes.OK) {
      ctx.body = {
        deleteDataset: deleteResult.message,
      };
      return;
    }

    // Create dataset again
    const createResult = await createDataset({
      accessToken,
      groupId,
      data: {
        name: originalTable,
        columns: request.columns,
      },
    });
    // Add updated data rows
    const addRowResult = await addRowToDataset({
      accessToken,
      groupId,
      datasetId: createResult.datasetId,
      data: {
        table: createResult.table,
        rows: request.rows,
      },
    });

    // response
    ctx.body = {
      deleteDataset: deleteResult.message,
      createDataset: createResult.message,
      addFirstRow: addRowResult.message,
      data: {
        datasetId: createResult.datasetId,
        table: createResult.table,
      },
    };
  }
});



type RebindReportResult = {
  code: number,
  message: string,
  reportId: string
};

datasetRouter.put("/datasets/:datasetId/tables/:table/rows/rebind", async (ctx) => {
  const originalDatasetId = ctx.params.datasetId;
  const originalTable = ctx.params.table;
  const request = ctx.request.body;

  const result = await getAuthToken();
  if (result.error) {
    ctx.body = {
      error: result.error,
      message: result.errorDescription,
    };
  } else {
    const accessToken = (result as TokenResponse).accessToken;

    // Create dataset again
    const createResult = await createDataset({
      accessToken,
      groupId,
      data: {
        name: originalTable,
        columns: request.columns,
      },
    });
    // Add updated data rows
    const addRowResult = await addRowToDataset({
      accessToken,
      groupId,
      datasetId: createResult.datasetId,
      data: {
        table: createResult.table,
        rows: request.rows,
      },
    });

    // Get Reports 
    const reports = await getReportsInGroup({accessToken, groupId});
    // Find relative dataset report
    const originalDatasetReports = (reports.data as Array<ReportResult>)
      .filter(report => report.datasetId === originalDatasetId);

    // Rebind new dataset on it
    let rebindResult: Array<RebindReportResult> = [];
    for(const report of originalDatasetReports) {
      const response = await rebindNewDatasetToReport({
        accessToken,
        groupId,
        reportId: report.id,
        newDatasetId: createResult.datasetId
      });
      rebindResult.push({
        code: response.code,
        message: response.message,
        reportId: report.id
      })
    }
    
    
    // Deleted datasets by specific table
    const deleteResult = await deleteDataset({
      accessToken,
      groupId,
      datasetId: originalDatasetId,
    });
    
    // response
    ctx.body = {
      deleteDataset: deleteResult.message,
      createDataset: createResult.message,
      addFirstRow: addRowResult.message,
      rebindReports: rebindResult.map(result => { 
        return {
          message: result.message,
          reportId: result.reportId
        }
      }),
      data: {
        datasetId: createResult.datasetId,
        table: createResult.table,
      },
    };
  }
});
