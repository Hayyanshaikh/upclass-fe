import type { UserAccount, UserApiItem } from "@/types/user-management";

export const userManipulator = (
  users: UserApiItem[] = [],
): UserAccount[] =>
  users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.name ?? "Unknown role",
    isActive: user.isActive ? "Active" : "Inactive",
    isSystem: user.isSystem ?? false,
  }));
