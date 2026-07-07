import { Elysia } from "elysia";
import { resolveAuthContext } from "../../../shared/auth/auth-context";
import { HttpError } from "../../../shared/errors/http-error";
import { courseFeedQuerySchema, paginationQuerySchema, savePostParamsSchema } from "../dto/feed.dto";
import { ForumService } from "../service/forum.service";

const requireAuth = (headers: Record<string, string | undefined>) => {
  const auth = resolveAuthContext(
    new Headers(
      Object.entries(headers).flatMap<[string, string]>(([key, value]) =>
        value ? [[key, value]] : []
      )
    )
  );

  if (!auth) {
    throw new HttpError(401, "Authentication is required", "UNAUTHENTICATED");
  }

  return auth;
};

export const createForumController = (service = new ForumService()) =>
  new Elysia({ prefix: "/api/v1" })
    .get("/posts", async ({ headers, query }) => {
      const auth = requireAuth(headers);
      const parsed = courseFeedQuerySchema.parse(query);
      return service.getFeed(auth, parsed);
    })
    .get("/saved-posts", async ({ headers, query }) => {
      const auth = requireAuth(headers);
      const parsed = paginationQuerySchema.parse(query);
      return service.getSavedPosts(auth, parsed.page, parsed.pageSize);
    })
    .put("/posts/:postId/save", async ({ headers, params }) => {
      const auth = requireAuth(headers);
      const parsed = savePostParamsSchema.parse(params);
      return service.setSavedState(auth, parsed.postId, "saved");
    })
    .delete("/posts/:postId/save", async ({ headers, params }) => {
      const auth = requireAuth(headers);
      const parsed = savePostParamsSchema.parse(params);
      return service.setSavedState(auth, parsed.postId, "unsaved");
    })
    .delete("/posts/:postId", async ({ headers, params }) => {
      const auth = requireAuth(headers);
      const parsed = savePostParamsSchema.parse(params);
      return service.removePost(auth, parsed.postId);
    });
