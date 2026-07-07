import { and, count, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../../../db/client";
import { courses, enrollments, posts, savedPosts } from "../../../db/schema";
import type { AuthContext } from "../../../shared/auth/auth-context";
import type { ForumPostViewEntity } from "../entities/forum-post-view.entity";
import type { PostEntity } from "../entities/post.entity";
import type { SavedPostEntity } from "../entities/saved-post.entity";
import { mapCourseRow, mapEnrollmentRow, mapForumPostViewRow, mapPostRow, mapSavedPostRow } from "./forum.entity-mappers";

export class ForumRepository {
  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    const result = await db
      .select({ userId: enrollments.userId, courseId: enrollments.courseId })
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
      .limit(1);

    return result.map(mapEnrollmentRow).length > 0;
  }

  async courseExists(courseId: string): Promise<boolean> {
    const result = await db
      .select({ id: courses.id, title: courses.title })
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    return result.map(mapCourseRow).length > 0;
  }

  async findVisiblePostsByCourse(
    auth: AuthContext,
    courseId: string,
    page: number,
    pageSize: number
  ): Promise<ForumPostViewEntity[]> {
    const offset = (page - 1) * pageSize;
    const activeSaveCount = sql<number>`COUNT(CASE WHEN ${savedPosts.deletedAt} IS NULL THEN 1 END)`;
    const currentUserHasSaved = sql<boolean>`BOOL_OR(CASE WHEN ${savedPosts.userId} = ${auth.userId} AND ${savedPosts.deletedAt} IS NULL THEN true ELSE false END)`;

    const rows = await db
      .select({
        id: posts.id,
        courseId: posts.courseId,
        authorId: posts.authorId,
        title: posts.title,
        body: posts.body,
        likeCount: posts.likeCount,
        viewCount: posts.viewCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        hasSaved: currentUserHasSaved,
        savesCount: activeSaveCount
      })
      .from(posts)
      .leftJoin(savedPosts, eq(savedPosts.postId, posts.id))
      .where(and(eq(posts.courseId, courseId), eq(posts.isRemoved, false)))
      .groupBy(posts.id)
      .orderBy(desc(posts.createdAt))
      .limit(pageSize)
      .offset(offset);

    return rows.map((row) =>
      mapForumPostViewRow({
        ...row,
        hasSaved: Boolean(row.hasSaved),
        savesCount: Number(row.savesCount)
      })
    );
  }

  async countVisiblePostsByCourse(courseId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(posts)
      .where(and(eq(posts.courseId, courseId), eq(posts.isRemoved, false)));

    return Number(result[0]?.count ?? 0);
  }

  async countVisiblePostsForModerator(): Promise<number> {
    const result = await db.select({ count: count() }).from(posts).where(eq(posts.isRemoved, false));
    return Number(result[0]?.count ?? 0);
  }

  async findVisiblePostById(postId: string): Promise<PostEntity | null> {
    const result = await db
      .select({
        id: posts.id,
        courseId: posts.courseId,
        authorId: posts.authorId,
        title: posts.title,
        body: posts.body,
        likeCount: posts.likeCount,
        viewCount: posts.viewCount,
        commentCount: posts.commentCount,
        isRemoved: posts.isRemoved,
        createdAt: posts.createdAt
      })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    return result[0] ? mapPostRow(result[0]) : null;
  }

  async findSavedRecord(userId: string, postId: string): Promise<SavedPostEntity | null> {
    const result = await db
      .select({
        id: savedPosts.id,
        userId: savedPosts.userId,
        postId: savedPosts.postId,
        createdAt: savedPosts.createdAt,
        updatedAt: savedPosts.updatedAt,
        deletedAt: savedPosts.deletedAt
      })
      .from(savedPosts)
      .where(and(eq(savedPosts.userId, userId), eq(savedPosts.postId, postId)))
      .limit(1);

    return result[0] ? mapSavedPostRow(result[0]) : null;
  }

  async createSavedRecord(userId: string, postId: string) {
    await db.insert(savedPosts).values({
      id: `${userId}-${postId}`,
      userId,
      postId,
      deletedAt: null
    });
  }

  async reactivateSavedRecord(id: string) {
    await db
      .update(savedPosts)
      .set({
        deletedAt: null,
        updatedAt: new Date()
      })
      .where(eq(savedPosts.id, id));
  }

  async softDeleteSavedRecord(id: string) {
    await db
      .update(savedPosts)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(savedPosts.id, id));
  }

  async countActiveSaves(postId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(savedPosts)
      .where(and(eq(savedPosts.postId, postId), isNull(savedPosts.deletedAt)));

    return Number(result[0]?.count ?? 0);
  }

  async findSavedPostsForUser(auth: AuthContext, page: number, pageSize: number): Promise<ForumPostViewEntity[]> {
    const offset = (page - 1) * pageSize;
    const rows = await db
      .select({
        id: posts.id,
        courseId: posts.courseId,
        authorId: posts.authorId,
        title: posts.title,
        body: posts.body,
        likeCount: posts.likeCount,
        viewCount: posts.viewCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt
      })
      .from(savedPosts)
      .innerJoin(posts, eq(posts.id, savedPosts.postId))
      .where(
        and(eq(savedPosts.userId, auth.userId), isNull(savedPosts.deletedAt), eq(posts.isRemoved, false))
      )
      .orderBy(desc(savedPosts.updatedAt), desc(savedPosts.id))
      .limit(pageSize)
      .offset(offset);

    if (rows.length === 0) {
      return [];
    }

    const postIds = rows.map((row) => row.id);
    const counts = await db
      .select({
        postId: savedPosts.postId,
        count: count()
      })
      .from(savedPosts)
      .where(and(inArray(savedPosts.postId, postIds), isNull(savedPosts.deletedAt)))
      .groupBy(savedPosts.postId);

    const countsByPostId = new Map(counts.map((row) => [row.postId, Number(row.count)]));

    return rows.map((row) =>
      mapForumPostViewRow({
        ...row,
        hasSaved: true,
        savesCount: countsByPostId.get(row.id) ?? 0
      })
    );
  }

  async countSavedPostsForUser(auth: AuthContext): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(savedPosts)
      .innerJoin(posts, eq(posts.id, savedPosts.postId))
      .where(and(eq(savedPosts.userId, auth.userId), isNull(savedPosts.deletedAt), eq(posts.isRemoved, false)));

    return Number(result[0]?.count ?? 0);
  }

  async findCourseIdsForStudent(userId: string): Promise<string[]> {
    const rows = await db
      .select({ userId: enrollments.userId, courseId: enrollments.courseId })
      .from(enrollments)
      .where(eq(enrollments.userId, userId));

    return rows.map(mapEnrollmentRow).map((row) => row.courseId);
  }

  async findVisiblePostsForModerator(page: number, pageSize: number, auth: AuthContext): Promise<ForumPostViewEntity[]> {
    const offset = (page - 1) * pageSize;
    const activeSaveCount = sql<number>`COUNT(CASE WHEN ${savedPosts.deletedAt} IS NULL THEN 1 END)`;
    const currentUserHasSaved = sql<boolean>`BOOL_OR(CASE WHEN ${savedPosts.userId} = ${auth.userId} AND ${savedPosts.deletedAt} IS NULL THEN true ELSE false END)`;

    const rows = await db
      .select({
        id: posts.id,
        courseId: posts.courseId,
        authorId: posts.authorId,
        title: posts.title,
        body: posts.body,
        likeCount: posts.likeCount,
        viewCount: posts.viewCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        hasSaved: currentUserHasSaved,
        savesCount: activeSaveCount
      })
      .from(posts)
      .leftJoin(savedPosts, eq(savedPosts.postId, posts.id))
      .where(eq(posts.isRemoved, false))
      .groupBy(posts.id)
      .orderBy(desc(posts.createdAt))
      .limit(pageSize)
      .offset(offset);

    return rows.map((row) =>
      mapForumPostViewRow({
        ...row,
        hasSaved: Boolean(row.hasSaved),
        savesCount: Number(row.savesCount)
      })
    );
  }

  async markPostRemoved(postId: string) {
    await db.update(posts).set({ isRemoved: true }).where(eq(posts.id, postId));
  }
}
