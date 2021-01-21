import * as Router from "koa-router";
import { PowerBIDatasetService } from "../apps/services";
import * as Config from "../config.json";

export const datasetRouter = new Router();
const groupId = Config.groupId;


// Create Datasets and add Data Row
datasetRouter.post("/datasets", async (ctx) => {
  const { table, columns, rows } = ctx.request.body;
  const accessToken = ctx.state.accessToken;
  const datasetService = new PowerBIDatasetService({ accessToken, groupId });
  const createResult = await datasetService.createDataset({
    table,
    columns,
    rows,
  });

  ctx.body = createResult;
});


// Update Datasets and add Data Row
datasetRouter.put("/datasets/:datasetId/tables/:table/rows", async (ctx) => {
  const originalDatasetId = ctx.params.datasetId;
  const originalTable = ctx.params.table;
  const { columns, rows } = ctx.request.body;

  const accessToken = ctx.state.accessToken;
  const datasetService = new PowerBIDatasetService({ accessToken, groupId });
  const command = {
    table: originalTable,
    columns,
    rows,
  };
  const updateResult = await datasetService.updateDataset(
    originalDatasetId,
    command
  );

  // response
  ctx.body = updateResult;
});


// Update Datasets and add Data Row with auto Rebind (Relative original datasets will rebind)
datasetRouter.put(
  "/datasets/:datasetId/tables/:table/rows/rebind",
  async (ctx) => {
    const originalDatasetId = ctx.params.datasetId;
    const originalTable = ctx.params.table;
    const { columns, rows } = ctx.request.body;

    const accessToken = ctx.state.accessToken;
    const datasetService = new PowerBIDatasetService({ accessToken, groupId });
    const command = {
      table: originalTable,
      columns,
      rows,
    };
    const rebindResult = await datasetService.rebindDatasetToReports(
      originalDatasetId,
      command
    );

    // response
    ctx.body = rebindResult;
  }
);
