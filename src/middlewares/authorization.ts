import { Context, Next } from "koa";
import { TokenResponse } from "adal-node";
import { getAuthToken } from "../powerbi";

// Middleware for authorizing service principal getting access token.
export const authorize = ({
  clientId,
  clientSecret,
  tenantId,
}: {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}) => {
  return async (ctx: Context, next: Next) => {
    const result = await getAuthToken({ clientId, clientSecret, tenantId });
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
  };
};
