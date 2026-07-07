"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { messages, type Locale } from "@/shared/i18n/messages";
import { useDemoPreferences } from "@/shared/providers/demo-preferences-provider";
import { demoUsers, getDefaultDemoUser } from "../api/demo-auth";
import { useForumFeed } from "../hooks/use-forum-feed";
import { useRemovePost } from "../hooks/use-remove-post";
import { useSavedPosts } from "../hooks/use-saved-posts";
import { useSaveToggle } from "../hooks/use-save-toggle";
import { PostCard } from "./post-card";

type ForumDashboardProps = {
  health: {
    status: string;
    service: string;
  };
  view: "feed" | "saved";
};

const courseOptions = [
  { value: "course-frontend", labelKey: "courseFrontend" as const },
  { value: "course-backend", labelKey: "courseBackend" as const },
  { value: "course-data", labelKey: "courseData" as const },
  { value: "course-cloud", labelKey: "courseCloud" as const },
  { value: "course-design", labelKey: "courseDesign" as const },
  { value: "course-security", labelKey: "courseSecurity" as const }
];

export const ForumDashboard = ({ health, view }: ForumDashboardProps) => {
  const feedPageSize = 3;
  const savedPageSize = 3;
  const {
    locale,
    setLocale,
    selectedUserKey,
    setSelectedUserKey,
    courseId,
    setCourseId
  } = useDemoPreferences();

  const copy = messages[locale];
  const selectedUser =
    demoUsers.find((user) => `${user.userId}:${user.role}` === selectedUserKey) ??
    getDefaultDemoUser("student-1", "student");
  const [feedPage, setFeedPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const availableCourses = useMemo(
    () =>
      selectedUser.role === "moderator"
        ? [{ value: "all", label: copy.allCoursesLabel }, ...courseOptions.map((course) => ({ ...course, label: copy[course.labelKey] }))]
        : courseOptions
            .filter((course) => selectedUser.visibleCourseIds.includes(course.value))
            .map((course) => ({ ...course, label: copy[course.labelKey] })),
    [selectedUser]
  );

  useEffect(() => {
    if (selectedUser.role === "moderator") {
      return;
    }

    if (!selectedUser.visibleCourseIds.includes(courseId)) {
      setCourseId(selectedUser.defaultCourseId);
    }
  }, [courseId, selectedUser]);

  useEffect(() => {
    setFeedPage(1);
    setSavedPage(1);
  }, [selectedUserKey]);

  useEffect(() => {
    setFeedPage(1);
  }, [courseId]);

  const feedQuery = useForumFeed(courseId, selectedUser, feedPage, feedPageSize, view === "feed");
  const savedPostsQuery = useSavedPosts(selectedUser, savedPage, savedPageSize, view === "saved");
  const toggleMutation = useSaveToggle(
    courseId,
    selectedUser,
    feedPage,
    feedPageSize,
    savedPage,
    savedPageSize
  );
  const removeMutation = useRemovePost(courseId, selectedUser);
  const feedItems = feedQuery.data?.items ?? [];
  const savedItems = savedPostsQuery.data?.items ?? [];
  const feedTotal = feedQuery.data?.total ?? 0;
  const savedTotal = savedPostsQuery.data?.total ?? 0;

  useEffect(() => {
    const totalPages = feedQuery.data?.totalPages ?? 0;
    if (totalPages > 0 && feedPage > totalPages) {
      setFeedPage(totalPages);
    }
  }, [feedPage, feedQuery.data?.totalPages]);

  useEffect(() => {
    const totalPages = savedPostsQuery.data?.totalPages ?? 0;
    if (totalPages > 0 && savedPage > totalPages) {
      setSavedPage(totalPages);
    }

    if (totalPages === 0 && savedPage !== 1) {
      setSavedPage(1);
    }
  }, [savedPage, savedPostsQuery.data?.totalPages]);

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="hero">
          <h1>{copy.appTitle}</h1>
          <p>{copy.appDescription}</p>
          <div className="hero-meta">
            <span>
              {copy.apiStatus}: <strong className="status-ok">{health.status}</strong>
            </span>
            <span>
              {copy.authLabel}: <strong>{selectedUser.label}</strong>
            </span>
            <span>{health.service}</span>
          </div>
        </section>

        <section className="panel control-panel">
          <div className="toolbar toolbar-stacked">
            <div>
              <h2>{copy.filtersTitle}</h2>
            </div>
            <div className="toolbar-group toolbar-group-wide">
              <label className="field">
                <span>{copy.demoUserLabel}</span>
                <select value={selectedUserKey} onChange={(event) => setSelectedUserKey(event.target.value)}>
                  {demoUsers.map((user) => (
                    <option key={`${user.userId}:${user.role}`} value={`${user.userId}:${user.role}`}>
                      {user.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{copy.courseLabel}</span>
                <select value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                  {availableCourses.map((course) => (
                    <option key={course.value} value={course.value}>
                      {course.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{copy.localeLabel}</span>
                <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
                  <option value="en">{copy.localeEnglish}</option>
                  <option value="es">{copy.localeSpanish}</option>
                </select>
              </label>
            </div>
          </div>

          <nav className="view-nav" aria-label={copy.forumViewsLabel}>
            <Link className={view === "feed" ? "view-tab view-tab-active" : "view-tab"} href="/feed">
              {copy.feedTitle}
            </Link>
            <Link className={view === "saved" ? "view-tab view-tab-active" : "view-tab"} href="/saved">
              {copy.savedTitle}
            </Link>
          </nav>
        </section>

        {view === "feed" ? (
          <div className="grid single-panel-grid">
            <section className="panel panel-column">
              <div className="section-head">
                <div>
                  <h2>{copy.feedTitle}</h2>
                  <p>{copy.feedDescription}</p>
                </div>
                <div className="section-stat">
                  {feedTotal} {copy.itemsLabel}
                </div>
              </div>

              <div className="status-row">
                {feedQuery.isError ? <div className="error-text">{copy.loadFailed}</div> : <div className="status-spacer" />}
              </div>

              <div
                className={`stack content-area content-area-feed content-scroll${feedQuery.isFetching ? " content-loading" : ""}`}
              >
                {feedItems.map((post) => (
                  <PostCard
                    key={post.id}
                    locale={locale}
                    post={post}
                    isPending={toggleMutation.isPending}
                    isRemoving={removeMutation.isPending}
                    onRemovePost={
                      selectedUser.role === "moderator"
                        ? (selectedPost) => removeMutation.mutate(selectedPost.id)
                        : undefined
                    }
                    onToggleSave={(selectedPost) =>
                      toggleMutation.mutate({
                        postId: selectedPost.id,
                        hasSaved: selectedPost.hasSaved
                      })
                    }
                  />
                ))}
              </div>

              <div className="pagination-bar">
                <div className="pagination-copy">
                  <span className="pagination-meta">
                    {copy.pageLabel(feedQuery.data?.page ?? feedPage, feedQuery.data?.totalPages ?? 0)}
                  </span>
                  <span className="pagination-subtle">{copy.currentPageCountLabel(feedItems.length)}</span>
                </div>
                <span className="pagination-total">{copy.totalCountLabel(feedTotal)}</span>
                <div className="pagination-actions">
                  <button
                    className="button-secondary"
                    disabled={!feedQuery.data?.hasPreviousPage || feedQuery.isFetching}
                    onClick={() => setFeedPage((current) => Math.max(1, current - 1))}
                  >
                    {copy.previousLabel}
                  </button>
                  <button
                    className="button-secondary"
                    disabled={!feedQuery.data?.hasNextPage || feedQuery.isFetching}
                    onClick={() => setFeedPage((current) => current + 1)}
                  >
                    {copy.nextLabel}
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="grid single-panel-grid">
            <section className="panel panel-column">
              <div className="section-head">
                <div>
                  <h2>{copy.savedTitle}</h2>
                  <p>{copy.savedDescription}</p>
                </div>
                <div className="section-stat">
                  {savedTotal} {copy.itemsLabel}
                </div>
              </div>

              <div className="status-row">
                <div className="status-spacer" />
              </div>

              <div
                className={`content-area content-area-wide content-scroll${savedPostsQuery.isFetching ? " content-loading" : ""}`}
              >
                {savedItems.length ? (
                  <div className="stack">
                    {savedItems.map((post) => (
                      <PostCard key={post.id} locale={locale} post={post} showSavedState={false} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">{copy.emptySaved}</div>
                )}
              </div>

              <div className="pagination-bar">
                <div className="pagination-copy">
                  <span className="pagination-meta">
                    {copy.pageLabel(savedPostsQuery.data?.page ?? savedPage, savedPostsQuery.data?.totalPages ?? 0)}
                  </span>
                  <span className="pagination-subtle">{copy.currentPageCountLabel(savedItems.length)}</span>
                </div>
                <span className="pagination-total">{copy.totalCountLabel(savedTotal)}</span>
                <div className="pagination-actions">
                  <button
                    className="button-secondary"
                    disabled={!savedPostsQuery.data?.hasPreviousPage || savedPostsQuery.isFetching}
                    onClick={() => setSavedPage((current) => Math.max(1, current - 1))}
                  >
                    {copy.previousLabel}
                  </button>
                  <button
                    className="button-secondary"
                    disabled={!savedPostsQuery.data?.hasNextPage || savedPostsQuery.isFetching}
                    onClick={() => setSavedPage((current) => current + 1)}
                  >
                    {copy.nextLabel}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
