import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";

const app = new Koa();
const router = new Router();

// The Application Key for accessing Power BI Rest API
const appId = "eab21c7c-1e11-41fc-8f80-1b2fa9a030e1";
const appSecret = "rQ9lZEMyuyq_TjQUVd~0NEtY09T_~~4J.7";


app.use(bodyParser(
    { enableTypes: ['json', 'form', 'text'] }
  ));

router.get("/", async ctx => {
    ctx.body = "Hello Push Dataset";
});

router.post("/credentials", async ctx => {
    const req =  ctx.request.body;
    ctx.body = req
});


app.use(router.routes());
app.use(router.allowedMethods());
app.listen(5000);