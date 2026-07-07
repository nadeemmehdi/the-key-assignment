const required = (value: string | undefined, fallback: string) => value ?? fallback;

export const clientEnv = {
  apiBaseUrl: required(process.env.NEXT_PUBLIC_API_BASE_URL, "http://localhost:3001"),
  demoUserId: required(process.env.NEXT_PUBLIC_DEMO_USER_ID, "student-1"),
  demoUserRole: required(process.env.NEXT_PUBLIC_DEMO_USER_ROLE, "student") as "student" | "moderator"
};
