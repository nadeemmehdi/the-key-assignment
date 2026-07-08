import { Elysia } from "elysia";
import { toErrorResponse } from "./shared/http/error-response.js";
import { createForumController } from "./modules/forum/controller/forum.controller.js";

export const createApp = () =>
  new Elysia()
    .onError(({ error, path, request, set }) => {
      if (!(error instanceof Error && error.name === "HttpError")) {
        console.error("Unhandled application error", {
          method: request.method,
          path,
          error
        });
      }

      const response = toErrorResponse(error);
      set.status = response.status;
      return response.body;
    })
    .get("/health", () => ({
      status: "ok",
      service: "web-server"
    }))
    .use(createForumController());
