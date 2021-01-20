import * as Router from "koa-router";
import { TokenResponse } from "adal-node";
import {
  getAuthToken,
  getReportsInGroup,
  rebindNewDatasetToReport,
} from "../powerbi";



export const reportRouter = new Router();

const groupId = "7bfe2581-d6e3-40e7-8b2f-87544d022b44";


reportRouter.get("/reports", async (ctx) => {
    const result = await getAuthToken();
    if (result.error) {
      ctx.body = {
        error: result.error,
        message: result.errorDescription,
      };
    } else {
      const accessToken = (result as TokenResponse).accessToken;
      const response = await getReportsInGroup({ accessToken, groupId });
      ctx.body = {
        code: response.code,
        message: response.message,
        data: response.data,
      };
    }
  });
  
  reportRouter.get("/reports/:reportId/rebind", async (ctx) => {
    const reportId = ctx.params.reportId;
    // New dataset for report to rebind.
    const datasetId = ctx.params.datasetId;
    const result = await getAuthToken();
    if (result.error) {
      ctx.body = {
        error: result.error,
        message: result.errorDescription,
      };
    } else {
      const accessToken = (result as TokenResponse).accessToken;
      const response = await rebindNewDatasetToReport({
        accessToken,
        groupId,
        reportId,
        newDatasetId: datasetId,
      });
      ctx.body = {
        code: response.code,
        message: response.message,
      };
    }
  });
  
  