import * as Router from "koa-router";
import { TokenResponse } from "adal-node";
import {
  getAuthToken,
  getGroups,
} from "../powerbi";


export const groupRouter = new Router();

groupRouter.get("/groups", async (ctx) => {
    const result = await getAuthToken();
    if (result.error) {
      ctx.body = {
        error: result.error,
        message: result.errorDescription,
      };
    } else {
      const accessToken = (result as TokenResponse).accessToken;
      const response = await getGroups(accessToken);
  
      ctx.body = {
        code: response.code,
        message: response.message,
        data: response.data,
      };
    }
  });