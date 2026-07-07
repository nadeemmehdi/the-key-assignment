import { z } from "zod";

export const forumPostDtoSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string(),
  body: z.string(),
  likeCount: z.number().int().nonnegative(),
  viewCount: z.number().int().nonnegative(),
  commentCount: z.number().int().nonnegative(),
  hasSaved: z.boolean(),
  savesCount: z.number().int().nonnegative(),
  createdAt: z.string()
});

export const paginatedForumPostsSchema = z.object({
  items: z.array(forumPostDtoSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean()
});

export type ForumPostDto = z.infer<typeof forumPostDtoSchema>;
