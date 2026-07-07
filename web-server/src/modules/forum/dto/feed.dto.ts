import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(20).default(10)
});

export const courseFeedQuerySchema = paginationQuerySchema.extend({
  courseId: z.string().min(1)
});

export const savePostParamsSchema = z.object({
  postId: z.string().min(1)
});

export type CourseFeedQueryDto = z.infer<typeof courseFeedQuerySchema>;
export type SavePostParamsDto = z.infer<typeof savePostParamsSchema>;

