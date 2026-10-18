import type { LoginResponseUserDto } from "@/app/api/schemas";
import type { UserAccount } from "@/types/user-management";

export const userManipulator = (
  users: LoginResponseUserDto[] = [],
): UserAccount[] =>
  users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.name ?? "Unknown role",
    isActive: user.isActive ? "Active" : "Inactive",
  }));
