import { createApp } from "./app";
import { getEnv } from "./shared/config/env";
import { getCorsHeaders, withCors } from "./shared/http/cors";

const app = createApp();
const { CORS_ALLOWED_ORIGINS } = getEnv();
const allowedOrigins = CORS_ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const handleRequest = async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(request.headers.get("origin"), allowedOrigins)
    });
  }

  const response = await app.handle(request);
  return withCors(request, response, allowedOrigins);
};

export default Object.assign(app, {
  fetch: handleRequest
});
