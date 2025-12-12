import { Role } from "@prisma/client";

export type AdminUserPayload = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};
