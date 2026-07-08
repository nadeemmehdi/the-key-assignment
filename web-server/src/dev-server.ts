import { createServer } from "node:http";
import { loadEnvFile } from "./shared/config/env-file";

loadEnvFile();

const [{ createApp }, { getEnv }] = await Promise.all([import("./app"), import("./shared/config/env")]);

const { PORT } = getEnv();
const app = createApp();

const readRequestBody = async (request: import("node:http").IncomingMessage) => {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
};

const server = createServer(async (request, response) => {
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
