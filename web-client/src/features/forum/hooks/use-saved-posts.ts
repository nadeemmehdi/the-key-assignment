import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { forumApi } from "../api/forum-api";
import { forumQueryKeys } from "../api/query-keys";
import type { DemoUser } from "../api/demo-auth";

export const useSavedPosts = (user: DemoUser, page: number, pageSize: number, enabled = true) =>
  useQuery({
    queryKey: forumQueryKeys.savedPosts(user.userId, user.role, page, pageSize),
    queryFn: () => forumApi.getSavedPosts(user, page, pageSize),
    placeholderData: keepPreviousData,
    enabled
  });
