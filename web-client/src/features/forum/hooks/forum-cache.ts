import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { DemoUser } from "../api/demo-auth";
import type { ForumPost, PaginatedPosts } from "../api/forum.schemas";

const isFeedKeyForUser = (queryKey: QueryKey, user: DemoUser) =>
  Array.isArray(queryKey) &&
  queryKey[0] === "feed" &&
  queryKey[2] === user.userId &&
  queryKey[3] === user.role;

const isSavedPostsKeyForUser = (queryKey: QueryKey, user: DemoUser) =>
  Array.isArray(queryKey) &&
  queryKey[0] === "saved-posts" &&
  queryKey[1] === user.userId &&
  queryKey[2] === user.role;

const toPagination = (page: number, pageSize: number, total: number) => {
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    total,
    totalPages,
    hasNextPage: totalPages > 0 && page < totalPages,
    hasPreviousPage: page > 1
  };
};

const updateFeedPosts = (
  data: PaginatedPosts | undefined,
  postId: string,
  updater: (post: ForumPost) => ForumPost
) => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    items: data.items.map((post) => (post.id === postId ? updater(post) : post))
  };
};

const updateSavedPosts = (
  data: PaginatedPosts | undefined,
  queryKey: QueryKey,
  postId: string,
  updater: (post: ForumPost) => ForumPost | null,
  optimisticInsert?: ForumPost
) => {
  if (!data || !Array.isArray(queryKey)) {
    return data;
  }

  const page = Number(queryKey[3]);
  const pageSize = Number(queryKey[4]);
  const nextItems = data.items
    .map((post) => (post.id === postId ? updater(post) : post))
    .filter((post): post is ForumPost => post !== null);

  let items = nextItems;
  let total = data.total;

  if (optimisticInsert && page === 1 && !items.some((post) => post.id === optimisticInsert.id)) {
    items = [optimisticInsert, ...items].slice(0, pageSize);
    total += 1;
  } else if (nextItems.length !== data.items.length) {
    total = Math.max(0, total - 1);
  }

  return {
    ...data,
    items,
    ...toPagination(page, pageSize, total)
  };
};

export type OptimisticSnapshot = {
  feed: Array<[QueryKey, PaginatedPosts | undefined]>;
  savedPosts: Array<[QueryKey, PaginatedPosts | undefined]>;
};

export const snapshotForumQueries = (queryClient: QueryClient, user: DemoUser): OptimisticSnapshot => ({
  feed: queryClient
    .getQueriesData<PaginatedPosts>({ queryKey: ["feed"] })
    .filter(([queryKey]) => isFeedKeyForUser(queryKey, user)),
  savedPosts: queryClient
    .getQueriesData<PaginatedPosts>({ queryKey: ["saved-posts"] })
    .filter(([queryKey]) => isSavedPostsKeyForUser(queryKey, user))
});

export const restoreForumQueries = (queryClient: QueryClient, snapshot: OptimisticSnapshot) => {
  for (const [queryKey, data] of snapshot.feed) {
    queryClient.setQueryData(queryKey, data);
  }

  for (const [queryKey, data] of snapshot.savedPosts) {
    queryClient.setQueryData(queryKey, data);
  }
};

export const applyOptimisticSaveToggle = (
  queryClient: QueryClient,
  user: DemoUser,
  postId: string,
  willSave: boolean
) => {
  const snapshot = snapshotForumQueries(queryClient, user);
  const sourcePost = snapshot.feed.flatMap(([, data]) => data?.items ?? []).find((post) => post.id === postId);

  for (const [queryKey] of snapshot.feed) {
    queryClient.setQueryData<PaginatedPosts | undefined>(queryKey, (data) =>
      updateFeedPosts(data, postId, (post) => ({
        ...post,
        hasSaved: willSave,
        savesCount: Math.max(0, post.savesCount + (willSave ? 1 : -1))
      }))
    );
  }

  for (const [queryKey] of snapshot.savedPosts) {
    queryClient.setQueryData<PaginatedPosts | undefined>(queryKey, (data) =>
      updateSavedPosts(
        data,
        queryKey,
        postId,
        (post) =>
          willSave
            ? {
                ...post,
                hasSaved: true,
                savesCount: post.savesCount + 1
              }
            : null,
        willSave && sourcePost
          ? {
              ...sourcePost,
              hasSaved: true,
              savesCount: sourcePost.savesCount + 1
            }
          : undefined
      )
    );
  }

  return snapshot;
};

export const applyOptimisticRemovePost = (
  queryClient: QueryClient,
  user: DemoUser,
  postId: string
) => {
  const snapshot = snapshotForumQueries(queryClient, user);

  for (const [queryKey] of snapshot.feed) {
    queryClient.setQueryData<PaginatedPosts | undefined>(queryKey, (data) => {
      if (!data || !Array.isArray(queryKey)) {
        return data;
      }

      const page = Number(queryKey[4]);
      const pageSize = Number(queryKey[5]);
      const items = data.items.filter((post) => post.id !== postId);
      const total = items.length === data.items.length ? data.total : Math.max(0, data.total - 1);

      return {
        ...data,
        items,
        ...toPagination(page, pageSize, total)
      };
    });
  }

  for (const [queryKey] of snapshot.savedPosts) {
    queryClient.setQueryData<PaginatedPosts | undefined>(queryKey, (data) =>
      updateSavedPosts(data, queryKey, postId, () => null)
    );
  }

  return snapshot;
};
