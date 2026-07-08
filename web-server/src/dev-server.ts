import { createServer } from "node:http";
import { loadEnvFile } from "./shared/config/env-file.js";

loadEnvFile();

const [{ createApp }, { getEnv }, { getCorsHeaders }] = await Promise.all([
  import("./app.js"),
  import("./shared/config/env.js"),
  import("./shared/http/cors.js")
]);

const { PORT, CORS_ALLOWED_ORIGINS } = getEnv();
const app = createApp();
const allowedOrigins = CORS_ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const readRequestBody = async (request: import("node:http").IncomingMessage) => {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
    return undefined;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
};

const applyCorsHeaders = (
  response: import("node:http").ServerResponse,
  requestOrigin: string | null
) => {
  const corsHeaders = getCorsHeaders(requestOrigin, allowedOrigins);

  for (const [key, value] of Object.entries(corsHeaders)) {
    response.setHeader(key, value);
  }
};

const server = createServer(async (request, response) => {
  const requestOrigin = typeof request.headers.origin === "string" ? request.headers.origin : null;

  applyCorsHeaders(response, requestOrigin);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  const origin = `http://${request.headers.host ?? `localhost:${PORT}`}`;
  const url = new URL(request.url ?? "/", origin);
  const body = await readRequestBody(request);

  const webRequest = new Request(url, {
    method: request.method,
    headers: new Headers(
      Object.entries(request.headers).flatMap<[string, string]>(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((entry) => [key, entry] as [string, string]);
        }

        return value ? [[key, value]] : [];
      })
    ),
    body
  });

  const webResponse = await app.handle(webRequest);
  response.statusCode = webResponse.status;

  webResponse.headers.forEach((value, key) => {
    response.setHeader(key, value);
  });

  const arrayBuffer = await webResponse.arrayBuffer();
  response.end(Buffer.from(arrayBuffer));
});

server.listen(PORT, () => {
  console.log(`web-server listening on http://localhost:${PORT}`);
});
