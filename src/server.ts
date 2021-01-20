import * as Koa from "koa";
import * as json from "koa-json";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import { groupRouter, datasetRouter, reportRouter, tokenRouter } from "./routes";

const app = new Koa();
const indexRouter = new Router();

app.use(bodyParser({ enableTypes: ["json", "form", "text"] }));
app.use(json());

indexRouter.get("/", async (ctx) => {
  ctx.body = {
    data: "Hello Push Dataset",
  };
});


app.use(indexRouter.routes());
app.use(tokenRouter.routes());
app.use(groupRouter.routes());
app.use(datasetRouter.routes());
app.use(reportRouter.routes());
app.use(indexRouter.allowedMethods());
app.use(groupRouter.allowedMethods());
app.use(datasetRouter.allowedMethods());
app.use(reportRouter.allowedMethods());
app.listen(6000);
