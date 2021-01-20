import * as Router from "koa-router";
import { TokenResponse } from "adal-node";
import {
  getAuthToken,
} from "../powerbi";


export const tokenRouter = new Router();

tokenRouter.get("/token", async (ctx) => {
    const result = await getAuthToken();
    if (result.error) {
      ctx.body = {
        error: result.error,
        message: result.errorDescription,
      };
    } else {
      const accessToken = (result as TokenResponse).accessToken;
      ctx.body = {
        token: accessToken,
      };
    }
  });