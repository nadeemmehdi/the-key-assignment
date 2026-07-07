"use client";

import { messages, type Locale } from "@/shared/i18n/messages";
import type { ForumPost } from "../api/forum.schemas";
import { SaveToggleButton } from "./save-toggle-button";

type PostCardProps = {
  post: ForumPost;
  locale: Locale;
  onToggleSave?: (post: ForumPost) => void;
  onRemovePost?: (post: ForumPost) => void;
  isPending?: boolean;
  isRemoving?: boolean;
  showSavedState?: boolean;
};

export const PostCard = ({
  post,
  locale,
  onToggleSave,
  onRemovePost,
  isPending = false,
  isRemoving = false,
  showSavedState = true
}: PostCardProps) => {
  const copy = messages[locale];
  const courseLabels: Record<string, string> = {
    "course-frontend": copy.courseFrontend,
    "course-backend": copy.courseBackend,
    "course-data": copy.courseData,
    "course-cloud": copy.courseCloud,
    "course-design": copy.courseDesign,
    "course-security": copy.courseSecurity
  };
  const courseLabel = courseLabels[post.courseId] ?? post.courseId;

  return (
    <article className="post-card">
      <div className="post-card-top">
        <span className="pill">{courseLabel}</span>
        <div className="post-badges">
          {post.savesCount > 0 ? (
            <span className="meta-chip meta-chip-accent">{copy.saves(post.savesCount)}</span>
          ) : null}
          {showSavedState ? (
            <span className={`meta-chip ${post.hasSaved ? "meta-chip-saved" : "meta-chip-unsaved"}`}>
              {post.hasSaved ? copy.saved : copy.notSaved}
            </span>
          ) : null}
        </div>
      </div>
      <div className="post-title">{post.title}</div>
      <div className="post-body">{post.body}</div>
      <div className="post-meta post-stats">
        <span className="meta-chip meta-chip-muted">{copy.likesLabel(post.likeCount)}</span>
        <span className="meta-chip meta-chip-muted">{copy.viewsLabel(post.viewCount)}</span>
        <span className="meta-chip meta-chip-muted">{copy.commentsLabel(post.commentCount)}</span>
      </div>
      {onToggleSave || onRemovePost ? (
        <div className="post-actions">
          {onToggleSave ? (
            <SaveToggleButton
              hasSaved={post.hasSaved}
              isPending={isPending}
              locale={locale}
              onToggle={() => onToggleSave(post)}
            />
          ) : null}
          {onRemovePost ? (
            <button
              className="button-danger button-inline"
              disabled={isRemoving}
              onClick={() => onRemovePost(post)}
            >
              {isRemoving ? copy.removing : copy.remove}
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};
