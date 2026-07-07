import { z } from "zod";

export const forumPostSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string(),
  body: z.string(),
  likeCount: z.number(),
  viewCount: z.number(),
  commentCount: z.number(),
  hasSaved: z.boolean(),
  savesCount: z.number(),
  createdAt: z.string()
});

export const paginatedPostsSchema = z.object({
  items: z.array(forumPostSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean()
});

export const saveToggleResponseSchema = z.object({
  postId: z.string(),
  hasSaved: z.boolean(),
  savesCount: z.number()
});

export const removePostResponseSchema = z.object({
  postId: z.string(),
  removed: z.boolean()
});

export type ForumPost = z.infer<typeof forumPostSchema>;
export type PaginatedPosts = z.infer<typeof paginatedPostsSchema>;
