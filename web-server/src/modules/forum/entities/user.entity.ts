import type { Role } from "../../../shared/auth/auth-context";

export type UserEntity = {
  id: string;
  name: string;
  role: Role;
};
