import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DemoUser } from "../api/demo-auth";
import { forumApi } from "../api/forum-api";
import { applyOptimisticSaveToggle, restoreForumQueries } from "./forum-cache";

export const useSaveToggle = (courseId: string, user: DemoUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, hasSaved }: { postId: string; hasSaved: boolean }) =>
      hasSaved ? forumApi.unsavePost(postId, user) : forumApi.savePost(postId, user),
    onMutate: async ({ postId, hasSaved }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["feed"]
        }),
        queryClient.cancelQueries({
          queryKey: ["saved-posts"]
        })
      ]);

      const snapshot = applyOptimisticSaveToggle(queryClient, user, postId, !hasSaved);
      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      if (context?.snapshot) {
        restoreForumQueries(queryClient, context.snapshot);
      }
    },
    onSettled: async () => {
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
