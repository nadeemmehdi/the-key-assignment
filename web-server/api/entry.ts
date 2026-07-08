import { createApp } from "../src/app.js";
import { getEnv } from "../src/shared/config/env.js";
import { loadEnvFile } from "../src/shared/config/env-file.js";
import { getCorsHeaders } from "../src/shared/http/cors.js";

loadEnvFile();

const app = createApp();
const { CORS_ALLOWED_ORIGINS } = getEnv();
const allowedOrigins = CORS_ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const withCors = (response: Response, requestOrigin: string | null) => {
  const headers = new Headers(response.headers);
  const corsHeaders = getCorsHeaders(requestOrigin, allowedOrigins);

  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

export default {
  async fetch(request: Request) {
    const requestOrigin = request.headers.get("origin");

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }), requestOrigin);
    }

    const incomingUrl = new URL(request.url);
    const requestedPath = incomingUrl.searchParams.get("__pathname") ?? "/health";
    const normalizedUrl = new URL(request.url);
    normalizedUrl.pathname = requestedPath;
    normalizedUrl.searchParams.delete("__pathname");

    const appRequest = new Request(normalizedUrl, request);
    const response = await app.handle(appRequest);
    return withCors(response, requestOrigin);
  }
};
