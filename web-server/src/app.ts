import { Elysia } from "elysia";
import { toErrorResponse } from "./shared/http/error-response";
import { createForumController } from "./modules/forum/controller/forum.controller";

export const createApp = () =>
  new Elysia()
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
