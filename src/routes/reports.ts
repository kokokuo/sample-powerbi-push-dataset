import * as Router from "koa-router";
import { PowerBIReportService } from "../apps/services";

export const reportRouter = new Router();

const groupId = "7bfe2581-d6e3-40e7-8b2f-87544d022b44";

// List reports in specific group
reportRouter.get("/reports", async (ctx) => {
  const accessToken = ctx.state.accessToken;
  const reportService = new PowerBIReportService({ accessToken, groupId });
  const listResults = await reportService.listReports();
  // Response
  ctx.body = listResults;
});


// Rebind specific report by id in specific group
reportRouter.post("/reports/:reportId/rebind", async (ctx) => {
  const reportId = ctx.params.reportId;
  const request = ctx.request.body;
  const accessToken = ctx.state.accessToken;
  const reportService = new PowerBIReportService({ accessToken, groupId });
  const rebindResult = await reportService.rebindSpecificReport({
    reportId,
    datasetId: request.datasetId
  });
  // Response
  ctx.body = rebindResult;
});
