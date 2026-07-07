import { z } from "zod";

export const roleSchema = z.enum(["student", "moderator"]);
export type Role = z.infer<typeof roleSchema>;

export type AuthContext = {
  userId: string;
  role: Role;
};

export const resolveAuthContext = (headers: Headers): AuthContext | null => {
  const userId = headers.get("x-user-id");
  const role = headers.get("x-user-role");

  const result = z
    .object({
      userId: z.string().min(1),
      role: roleSchema
    })
    .safeParse({
      userId,
      role
    });

  if (!result.success) {
    return null;
  }

  return result.data;
};

