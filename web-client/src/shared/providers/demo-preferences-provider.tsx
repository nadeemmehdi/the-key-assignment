"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clientEnv } from "@/shared/config/env";
import { type Locale } from "@/shared/i18n/messages";
import { getDefaultDemoUser } from "@/features/forum/api/demo-auth";

type DemoPreferencesContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  selectedUserKey: string;
  setSelectedUserKey: (userKey: string) => void;
  courseId: string;
  setCourseId: (courseId: string) => void;
};

const storageKeys = {
  locale: "forum-demo-locale",
  user: "forum-demo-user",
  course: "forum-demo-course"
} as const;

const DemoPreferencesContext = createContext<DemoPreferencesContextValue | null>(null);

export const DemoPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const initialUser = getDefaultDemoUser(clientEnv.demoUserId, clientEnv.demoUserRole);
  const [locale, setLocale] = useState<Locale>("en");
  const [selectedUserKey, setSelectedUserKey] = useState(`${initialUser.userId}:${initialUser.role}`);
  const [courseId, setCourseId] = useState(initialUser.defaultCourseId);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedLocale = window.localStorage.getItem(storageKeys.locale) as Locale | null;
    const storedUserKey = window.localStorage.getItem(storageKeys.user);
    const storedCourseId = window.localStorage.getItem(storageKeys.course);

    if (storedLocale === "en" || storedLocale === "es") {
      setLocale(storedLocale);
    }

    if (storedUserKey) {
      setSelectedUserKey(storedUserKey);
    }

    if (storedCourseId) {
      setCourseId(storedCourseId);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeys.locale, locale);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeys.user, selectedUserKey);
    }
  }, [selectedUserKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeys.course, courseId);
    }
  }, [courseId]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      selectedUserKey,
      setSelectedUserKey,
      courseId,
      setCourseId
    }),
    [courseId, locale, selectedUserKey]
  );

  return <DemoPreferencesContext.Provider value={value}>{children}</DemoPreferencesContext.Provider>;
};

export const useDemoPreferences = () => {
  const context = useContext(DemoPreferencesContext);

  if (!context) {
    throw new Error("useDemoPreferences must be used within DemoPreferencesProvider");
  }

  return context;
};
