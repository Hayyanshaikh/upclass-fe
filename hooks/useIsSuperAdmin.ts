"use client";

import { useRolesControllerFindAll } from "@/app/api/endpoints";
import { useStorageStore } from "@/stores/storage";

export function useIsSuperAdmin() {
  const roleId = useStorageStore((state) => {
    const user = state.values.user;
    return user &&
      typeof user === "object" &&
      "roleId" in user &&
      typeof user.roleId === "string"
      ? user.roleId
      : undefined;
  });
  const { data, isLoading } = useRolesControllerFindAll();

  return {
    isSuperAdmin: Boolean(
      roleId &&
        data?.data.some(
          (role) => role.id === roleId && role.slug === "super_admin",
        ),
    ),
    isLoading,
  };
}
