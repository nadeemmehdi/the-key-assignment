import type { AuthContext } from "../../../shared/auth/auth-context";
import { HttpError } from "../../../shared/errors/http-error";
import { ForumRepository } from "../repository/forum.repository";
import type { CourseFeedQueryDto } from "../dto/feed.dto";
import type { ForumPostDto } from "../dto/post.dto";
import { decideSaveAction } from "../schemas/save-policy";

const toDto = (post: {
  id: string;
  courseId: string;
  title: string;
  body: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  hasSaved: boolean;
  savesCount: number;
  createdAt: Date;
}): ForumPostDto => ({
  id: post.id,
  courseId: post.courseId,
  title: post.title,
  body: post.body,
  likeCount: post.likeCount,
  viewCount: post.viewCount,
  commentCount: post.commentCount,
  hasSaved: post.hasSaved,
  savesCount: post.savesCount,
  createdAt: post.createdAt.toISOString()
});

const toPagination = (page: number, pageSize: number, total: number) => {
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: totalPages > 0 && page < totalPages,
    hasPreviousPage: page > 1
  };
};

export class ForumService {
  constructor(private readonly repository = new ForumRepository()) {}

  async getFeed(auth: AuthContext, query: CourseFeedQueryDto) {
    if (auth.role === "student") {
      if (query.courseId === "all") {
        throw new HttpError(403, "Students cannot view all courses", "COURSE_FORBIDDEN");
      }

      const enrolled = await this.repository.isUserEnrolled(auth.userId, query.courseId);
      if (!enrolled) {
        throw new HttpError(403, "You are not enrolled in this course", "COURSE_FORBIDDEN");
      }

      const items = await this.repository.findVisiblePostsByCourse(
        auth,
        query.courseId,
        query.page,
        query.pageSize
      );
      const total = await this.repository.countVisiblePostsByCourse(query.courseId);

      return {
        items: items.map(toDto),
        ...toPagination(query.page, query.pageSize, total)
      };
    }

    if (query.courseId === "all") {
      const items = await this.repository.findVisiblePostsForModerator(query.page, query.pageSize, auth);
      const total = await this.repository.countVisiblePostsForModerator();

      return {
        items: items.map(toDto),
        ...toPagination(query.page, query.pageSize, total)
      };
    }

    const courseExists = await this.repository.courseExists(query.courseId);
    if (!courseExists) {
      throw new HttpError(404, "Course not found", "COURSE_NOT_FOUND");
    }

    const items = await this.repository.findVisiblePostsByCourse(
      auth,
      query.courseId,
      query.page,
      query.pageSize
    );
    const total = await this.repository.countVisiblePostsByCourse(query.courseId);

    return {
      items: items.map(toDto),
      ...toPagination(query.page, query.pageSize, total)
    };
  }

  async getSavedPosts(auth: AuthContext, page: number, pageSize: number) {
    const items = await this.repository.findSavedPostsForUser(auth, page, pageSize);
    const total = await this.repository.countSavedPostsForUser(auth);

    return {
      items: items.map(toDto),
      ...toPagination(page, pageSize, total)
    };
  }

  async setSavedState(auth: AuthContext, postId: string, requestedState: "saved" | "unsaved") {
    const post = await this.repository.findVisiblePostById(postId);

    if (!post || post.isRemoved) {
      throw new HttpError(404, "Post not found", "POST_NOT_FOUND");
    }

    if (auth.role === "student") {
      const enrolled = await this.repository.isUserEnrolled(auth.userId, post.courseId);
      if (!enrolled) {
        throw new HttpError(403, "You cannot access this post", "POST_FORBIDDEN");
      }
    }

    const existing = await this.repository.findSavedRecord(auth.userId, postId);
    const decision = decideSaveAction(requestedState, {
      exists: Boolean(existing),
      isActive: Boolean(existing && existing.deletedAt === null)
    });

    if (decision.kind === "create") {
      await this.repository.createSavedRecord(auth.userId, postId);
    }

    if (decision.kind === "reactivate" && existing) {
      await this.repository.reactivateSavedRecord(existing.id);
    }

    if (decision.kind === "soft-delete" && existing) {
      await this.repository.softDeleteSavedRecord(existing.id);
    }

    const savesCount = await this.repository.countActiveSaves(postId);
    return {
      postId,
      hasSaved: requestedState === "saved",
      savesCount
    };
  }

  async removePost(auth: AuthContext, postId: string) {
    if (auth.role !== "moderator") {
      throw new HttpError(403, "Only moderators can remove posts", "POST_FORBIDDEN");
    }

    const post = await this.repository.findVisiblePostById(postId);

    if (!post || post.isRemoved) {
      throw new HttpError(404, "Post not found", "POST_NOT_FOUND");
    }

    await this.repository.markPostRemoved(postId);

    return {
      postId,
      removed: true
    };
  }
}
