import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DemoUser } from "../api/demo-auth";
import { forumApi } from "../api/forum-api";
import { forumQueryKeys } from "../api/query-keys";

export const useSaveToggle = (
  courseId: string,
  user: DemoUser,
  feedPage: number,
  feedPageSize: number,
  savedPage: number,
  savedPageSize: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, hasSaved }: { postId: string; hasSaved: boolean }) =>
      hasSaved ? forumApi.unsavePost(postId, user) : forumApi.savePost(postId, user),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["feed", courseId, user.userId, user.role]
        }),
        queryClient.invalidateQueries({
          queryKey: ["saved-posts", user.userId, user.role]
        })
      ]);
    }
  });
};
