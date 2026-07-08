const defaultAllowedHeaders = "content-type,x-user-id,x-user-role";
const defaultAllowedMethods = "GET,POST,PUT,DELETE,OPTIONS";

const isLocalOrigin = (origin: URL) =>
  origin.protocol === "http:" && (origin.hostname === "localhost" || origin.hostname === "127.0.0.1");

const isVercelPreviewOrigin = (origin: URL) =>
  origin.protocol === "https:" && origin.hostname.endsWith(".vercel.app");

export const getCorsHeaders = (requestOrigin: string | null, allowedOrigins: string[]) => {
  if (!requestOrigin) {
    return {
      "access-control-allow-methods": defaultAllowedMethods,
      "access-control-allow-headers": defaultAllowedHeaders,
      vary: "Origin"
    };
  }

  let resolvedOrigin: string | null = null;

  try {
    const originUrl = new URL(requestOrigin);

    if (
      allowedOrigins.includes(requestOrigin) ||
      isLocalOrigin(originUrl) ||
      isVercelPreviewOrigin(originUrl)
    ) {
      resolvedOrigin = requestOrigin;
    }
  } catch {
    resolvedOrigin = null;
  }

  return {
    ...(resolvedOrigin ? { "access-control-allow-origin": resolvedOrigin } : {}),
    "access-control-allow-methods": defaultAllowedMethods,
    "access-control-allow-headers": defaultAllowedHeaders,
    "access-control-allow-credentials": "true",
    vary: "Origin"
  };
};
