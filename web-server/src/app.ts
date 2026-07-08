import { Elysia } from "elysia";
import { toErrorResponse } from "./shared/http/error-response";
import { getEnv } from "./shared/config/env";
import { getCorsHeaders } from "./shared/http/cors";
import { createForumController } from "./modules/forum/controller/forum.controller";

const { CORS_ALLOWED_ORIGINS } = getEnv();
const allowedOrigins = CORS_ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const createApp = () =>
  new Elysia()
    .options("/*", ({ request }) => {
      const headers = getCorsHeaders(request.headers.get("origin"), allowedOrigins);
      return new Response(null, { status: 204, headers });
    })
    .onAfterHandle((context: {
      request: Request;
      responseValue: unknown;
    }) => {
      const response = context.responseValue;
      const headers = new Headers(response instanceof Response ? response.headers : undefined);
      const corsHeaders = getCorsHeaders(context.request.headers.get("origin"), allowedOrigins);

      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      if (response instanceof Response) {
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers
        });
      }

      return new Response(
        typeof response === "string" ? response : JSON.stringify(response),
        {
          status: 200,
          headers
        }
      );
    })
    .onError(({ error, set }) => {
      const response = toErrorResponse(error);
      set.status = response.status;
      return response.body;
    })
    .get("/health", () => ({
      status: "ok",
      service: "web-server"
    }))
    .use(createForumController());
