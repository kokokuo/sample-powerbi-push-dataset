import * as Koa from "koa";
import * as json from "koa-json";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import axios, { AxiosRequestConfig } from "axios";
import { getAuthToken, createDataset, addRowToDataset, deleteDataset } from "./powerbi";
import { TokenResponse } from "adal-node";
import { StatusCodes } from 'http-status-codes';
const app = new Koa();
const router = new Router();


const groupId = "7bfe2581-d6e3-40e7-8b2f-87544d022b44";
const groupsUrl = "https://api.powerbi.com/v1.0/myorg/groups";
const datasetInGroupUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets`;


app.use(bodyParser({ enableTypes: ['json', 'form', 'text'] }));
app.use(json());



router.get("/", async ctx => {
    ctx.body = {
      data: "Hello Push Dataset"
    };
});

router.get("/token", async ctx => {
    const result = await getAuthToken();
    if (result.error) {
      ctx.body = {
        error: result.error,
        message: result.errorDescription
      }
    } else {
      const accessToken = (result as TokenResponse).accessToken;
      ctx.body = {
        token: accessToken
      }
    }
});



router.get("/groups", async ctx => {
  const result = await getAuthToken();
  if (result.error) {
    ctx.body = {
      error: result.error,
      message: result.errorDescription
    }
  } else {
    const accessToken = (result as TokenResponse).accessToken;
    const config: AxiosRequestConfig = {
      headers: { 
        ContentType: "application/json",
        Authorization: `Bearer ${accessToken}` 
      }
    };
    const response = await axios.get(groupsUrl, config);  
    ctx.body = {
      code: response.status,
      message: response.statusText,
      data: response.data.value ?? null
    }
  }
});

router.post("/datasets", async ctx => {
  const request = ctx.request.body;
  
  const result = await getAuthToken();
  if (result.error) {
    ctx.body = {
      error: result.error,
      message: result.errorDescription
    }
  } else {
    const accessToken = (result as TokenResponse).accessToken;
    const createResult = await createDataset({
      accessToken,
      groupId, 
      data: {
        name: request.table,
        columns: request.columns
      }
    });
    // Add Initialized Data Row
    const addRowResult = await addRowToDataset({
      accessToken,
      groupId,
      datasetId: createResult.datasetId,
      data: {
        table: createResult.table,
        rows: request.rows
      }
    });
    
    ctx.body = {
      createDataset: createResult.message,
      addFirstRow: addRowResult.message,
      data: {
        datasetId: createResult.datasetId,
        table: createResult.table,
      }
    }
  } 
});


router.put("/datasets/:datasetId/tables/:table/rows", async ctx => {
  const originalDatasetId = ctx.params.datasetId;
  const originalTable = ctx.params.table;
  const request = ctx.request.body;
  
  const result = await getAuthToken();
  if (result.error) {
    ctx.body = {
      error: result.error,
      message: result.errorDescription
    }
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
        deleteDataset: deleteResult.message
      };
      return;
    } 

    // Create dataset again
    const createResult = await createDataset({
      accessToken,
      groupId, 
      data: {
        name: originalTable,
        columns: request.columns
      }
    });
    // Add updated data rows
    const addRowResult = await addRowToDataset({
      accessToken,
      groupId,
      datasetId: createResult.datasetId,
      data: {
        table: createResult.table,
        rows: request.rows
      }
    });

    // response
    ctx.body = {
      deleteDataset: deleteResult.message,
      createDataset: createResult.message,
      addFirstRow: addRowResult.message,
      data: {
        datasetId: createResult.datasetId,
        table: createResult.table,
      }
    };
  }
});



app.use(router.routes());
app.use(router.allowedMethods());
app.listen(6000);