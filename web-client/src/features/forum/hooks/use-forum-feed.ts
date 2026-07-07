import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { forumApi } from "../api/forum-api";
import { forumQueryKeys } from "../api/query-keys";
import type { DemoUser } from "../api/demo-auth";

export const useForumFeed = (
  courseId: string,
  user: DemoUser,
  page: number,
  pageSize: number,
  enabled = true
) =>
  useQuery({
    queryKey: forumQueryKeys.feed(courseId, user.userId, user.role, page, pageSize),
    queryFn: () => forumApi.getFeed(courseId, user, page, pageSize),
    placeholderData: keepPreviousData,
    enabled
  });
