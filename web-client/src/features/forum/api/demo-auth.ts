export type DemoRole = "student" | "moderator";

export type DemoUser = {
  userId: string;
  role: DemoRole;
  label: string;
  visibleCourseIds: string[];
  defaultCourseId: string;
};

export const demoUsers: DemoUser[] = [
  {
    userId: "student-1",
    role: "student",
    label: "Asha (student)",
    visibleCourseIds: ["course-frontend", "course-backend", "course-cloud"],
    defaultCourseId: "course-frontend"
  },
  {
    userId: "student-2",
    role: "student",
    label: "Mateo (student)",
    visibleCourseIds: ["course-backend", "course-data", "course-frontend", "course-design"],
    defaultCourseId: "course-backend"
  },
  {
    userId: "student-3",
    role: "student",
    label: "Priya (student)",
    visibleCourseIds: ["course-data", "course-security", "course-backend", "course-frontend"],
    defaultCourseId: "course-data"
  },
  {
    userId: "student-4",
    role: "student",
    label: "Liam (student)",
    visibleCourseIds: ["course-frontend", "course-design", "course-cloud"],
    defaultCourseId: "course-frontend"
  },
  {
    userId: "student-5",
    role: "student",
    label: "Zoe (student)",
    visibleCourseIds: ["course-security", "course-backend", "course-cloud", "course-data", "course-design"],
    defaultCourseId: "course-security"
  },
  {
    userId: "moderator-1",
    role: "moderator",
    label: "Jordan (moderator)",
    visibleCourseIds: [
      "course-frontend",
      "course-backend",
      "course-data",
      "course-cloud",
      "course-design",
      "course-security"
    ],
    defaultCourseId: "course-frontend"
  }
];

export const getDefaultDemoUser = (userId: string, role: DemoRole): DemoUser =>
  demoUsers.find((user) => user.userId === userId && user.role === role) ?? demoUsers[0];
