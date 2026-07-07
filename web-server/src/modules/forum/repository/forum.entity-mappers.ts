import type { Role } from "../../../shared/auth/auth-context";
import type { CourseEntity } from "../entities/course.entity";
import type { EnrollmentEntity } from "../entities/enrollment.entity";
import type { ForumPostViewEntity } from "../entities/forum-post-view.entity";
import type { PostEntity } from "../entities/post.entity";
import type { SavedPostEntity } from "../entities/saved-post.entity";
import type { UserEntity } from "../entities/user.entity";

export const mapCourseRow = (row: { id: string; title: string }): CourseEntity => ({
  id: row.id,
  title: row.title
});

export const mapEnrollmentRow = (row: { userId: string; courseId: string }): EnrollmentEntity => ({
  userId: row.userId,
  courseId: row.courseId
});

export const mapForumPostViewRow = (row: {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  body: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: Date;
  hasSaved: boolean;
  savesCount: number;
}): ForumPostViewEntity => ({
  id: row.id,
  courseId: row.courseId,
  authorId: row.authorId,
  title: row.title,
  body: row.body,
  likeCount: row.likeCount,
  viewCount: row.viewCount,
  commentCount: row.commentCount,
  createdAt: row.createdAt,
  hasSaved: row.hasSaved,
  savesCount: row.savesCount
});

export const mapPostRow = (row: {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  body: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  isRemoved: boolean;
  createdAt: Date;
}): PostEntity => ({
  id: row.id,
  courseId: row.courseId,
  authorId: row.authorId,
  title: row.title,
  body: row.body,
  likeCount: row.likeCount,
  viewCount: row.viewCount,
  commentCount: row.commentCount,
  isRemoved: row.isRemoved,
  createdAt: row.createdAt
});

export const mapSavedPostRow = (row: {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}): SavedPostEntity => ({
  id: row.id,
  userId: row.userId,
  postId: row.postId,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  deletedAt: row.deletedAt
});

export const mapUserRow = (row: { id: string; name: string; role: Role }): UserEntity => ({
  id: row.id,
  name: row.name,
  role: row.role
});
