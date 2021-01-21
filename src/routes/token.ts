import * as Router from "koa-router";

export const tokenRouter = new Router();


// Show access token
tokenRouter.get("/token", async (ctx) => {
    ctx.body = {
      token: ctx.state.accessToken
    };
});