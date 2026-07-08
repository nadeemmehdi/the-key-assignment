import type { Role } from "../../../shared/auth/auth-context.js";

export type UserEntity = {
  id: string;
  name: string;
  role: Role;
};
