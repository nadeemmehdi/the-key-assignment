import { beforeAll, describe, expect, it } from "vitest";
import { loadEnvFile } from "../../../shared/config/env-file";
import { createApp } from "../../../app";

loadEnvFile();

const app = createApp();

describe("forum controller", () => {
  beforeAll(async () => {
    // The DB must already be prepared by `pnpm db:setup` before running tests.
  });

  it("returns 401 for unauthenticated forum access", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/v1/posts?courseId=course-frontend&page=1&pageSize=10")
    );

    expect(response.status).toBe(401);
  });

  it("allows an enrolled student to save a visible post", async () => {
    const saveResponse = await app.handle(
      new Request("http://localhost/api/v1/posts/post-2/save", {
        method: "PUT",
        headers: {
          "x-user-id": "student-1",
          "x-user-role": "student"
        }
      })
    );

    expect(saveResponse.status).toBe(200);
    const saveBody = await saveResponse.json();
    expect(saveBody.hasSaved).toBe(true);

    const savedListResponse = await app.handle(
      new Request("http://localhost/api/v1/saved-posts?page=1&pageSize=10", {
        headers: {
          "x-user-id": "student-1",
          "x-user-role": "student"
        }
      })
    );

    expect(savedListResponse.status).toBe(200);
    const savedListBody = await savedListResponse.json();
    expect(savedListBody.items.some((item: { id: string }) => item.id === "post-2")).toBe(true);
  });

  it("allows a moderator to view all courses and remove a post", async () => {
    const feedResponse = await app.handle(
      new Request("http://localhost/api/v1/posts?courseId=all&page=1&pageSize=20", {
        headers: {
          "x-user-id": "moderator-1",
          "x-user-role": "moderator"
        }
      })
    );

    expect(feedResponse.status).toBe(200);
    const feedBody = await feedResponse.json();
    expect(feedBody.items.length).toBeGreaterThan(0);
    expect(feedBody.items.some((item: { courseId: string }) => item.courseId === "course-frontend")).toBe(true);
    expect(feedBody.items.some((item: { courseId: string }) => item.courseId === "course-backend")).toBe(true);

    const removeResponse = await app.handle(
      new Request("http://localhost/api/v1/posts/post-8", {
        method: "DELETE",
        headers: {
          "x-user-id": "moderator-1",
          "x-user-role": "moderator"
        }
      })
    );

    expect(removeResponse.status).toBe(200);

    const removedFeedResponse = await app.handle(
      new Request("http://localhost/api/v1/posts?courseId=all&page=1&pageSize=20", {
        headers: {
          "x-user-id": "moderator-1",
          "x-user-role": "moderator"
        }
      })
    );

    expect(removedFeedResponse.status).toBe(200);
    const removedFeedBody = await removedFeedResponse.json();
    expect(removedFeedBody.items.some((item: { id: string }) => item.id === "post-8")).toBe(false);
  });
});
