export const forumQueryKeys = {
  health: ["health"] as const,
  feed: (courseId: string, userId: string, role: string, page: number, pageSize: number) =>
    ["feed", courseId, userId, role, page, pageSize] as const,
  savedPosts: (userId: string, role: string, page: number, pageSize: number) =>
    ["saved-posts", userId, role, page, pageSize] as const
};
