import * as Router from "koa-router";
import { PowerBIGroupService } from "../apps/services";

export const groupRouter = new Router();

// Show the group
groupRouter.get("/groups", async (ctx) => {
  const accessToken = ctx.state.accessToken;
  const groupService = new PowerBIGroupService(accessToken);
  const listResult = await groupService.listGroups();

  // response
  ctx.body = listResult;
});
