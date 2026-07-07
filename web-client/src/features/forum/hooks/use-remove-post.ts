"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DemoUser } from "../api/demo-auth";
import { forumApi } from "../api/forum-api";

export const useRemovePost = (courseId: string, user: DemoUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => forumApi.removePost(postId, user),
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
