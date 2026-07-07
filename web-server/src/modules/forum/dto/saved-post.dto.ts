import { z } from "zod";
import { paginatedForumPostsSchema } from "./post.dto";

export const saveToggleResponseSchema = z.object({
  postId: z.string(),
  hasSaved: z.boolean(),
  savesCount: z.number().int().nonnegative()
});

export const savedPostsResponseSchema = paginatedForumPostsSchema;

