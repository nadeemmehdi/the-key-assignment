import { render, screen } from "@testing-library/react";
import { PostCard } from "./post-card";

describe("PostCard", () => {
  it("renders the save count copy from the catalog", () => {
    render(
      <PostCard
        locale="en"
        post={{
          id: "post-1",
          courseId: "course-frontend",
          title: "React Query cache basics",
          body: "Body",
          likeCount: 1,
          viewCount: 2,
          commentCount: 3,
          hasSaved: true,
          savesCount: 1,
          createdAt: "2026-01-01T00:00:00.000Z"
        }}
      />
    );

    expect(screen.getByText("1 save")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });
});

