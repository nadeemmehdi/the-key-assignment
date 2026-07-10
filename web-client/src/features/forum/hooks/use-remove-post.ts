"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DemoUser } from "../api/demo-auth";
import { forumApi } from "../api/forum-api";
import { applyOptimisticRemovePost, restoreForumQueries } from "./forum-cache";

export const useRemovePost = (courseId: string, user: DemoUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => forumApi.removePost(postId, user),
    onMutate: async (postId: string) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["feed"]
        }),
        queryClient.cancelQueries({
          queryKey: ["saved-posts"]
        })
      ]);

      const snapshot = applyOptimisticRemovePost(queryClient, user, postId);
      return { snapshot };
    },
    onError: (_error, _postId, context) => {
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
