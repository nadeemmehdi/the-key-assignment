import { clientEnv } from "@/shared/config/env";
import type { DemoUser } from "./demo-auth";
import { paginatedPostsSchema, removePostResponseSchema, saveToggleResponseSchema } from "./forum.schemas";

type FetchOptions = {
  method?: "GET" | "PUT" | "DELETE";
};

const authHeaders = (user: DemoUser) => ({
  "x-user-id": user.userId,
  "x-user-role": user.role
});

const request = async <T>(
  path: string,
  schema: { parse: (value: unknown) => T },
  user: DemoUser,
  options?: FetchOptions
) => {
  const response = await fetch(`${clientEnv.apiBaseUrl}${path}`, {
    method: options?.method ?? "GET",
    headers: authHeaders(user),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const json = await response.json();
  return schema.parse(json);
};

export const forumApi = {
  getHealth: async () => {
    const response = await fetch(`${clientEnv.apiBaseUrl}/health`, { cache: "no-store" });
    return response.json() as Promise<{ status: string; service: string }>;
  },
  getFeed: async (courseId: string, user: DemoUser, page: number, pageSize: number) =>
    request(
      `/api/v1/posts?courseId=${encodeURIComponent(courseId)}&page=${page}&pageSize=${pageSize}`,
      paginatedPostsSchema,
      user
    ),
  getSavedPosts: async (user: DemoUser, page: number, pageSize: number) =>
    request(`/api/v1/saved-posts?page=${page}&pageSize=${pageSize}`, paginatedPostsSchema, user),
  savePost: async (postId: string, user: DemoUser) =>
    request(`/api/v1/posts/${postId}/save`, saveToggleResponseSchema, user, { method: "PUT" }),
  unsavePost: async (postId: string, user: DemoUser) =>
    request(`/api/v1/posts/${postId}/save`, saveToggleResponseSchema, user, { method: "DELETE" }),
  removePost: async (postId: string, user: DemoUser) =>
    request(`/api/v1/posts/${postId}`, removePostResponseSchema, user, { method: "DELETE" })
};
