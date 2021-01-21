import { Context, Next} from "koa";
import { TokenResponse } from "adal-node";
import {
  getAuthToken,
} from "../powerbi";

// Middleware for authorizing service principal getting access token.
export const authorize = () => {
  return async (ctx: Context, next: Next) => {
    const result = await getAuthToken();
    if (result.error) {
      ctx.body = {
        error: result.error,
        message: result.errorDescription,
      };
    } else {
      const accessToken = (result as TokenResponse).accessToken;
      ctx.state.accessToken = accessToken; 
      // Go to the next middleware or original router
      await next();
    }
  }
} 
