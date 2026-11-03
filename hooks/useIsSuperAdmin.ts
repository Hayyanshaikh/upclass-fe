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

  const currentRole = data?.data.find((role) => role.id === roleId);

  return {
    isSuperAdmin: currentRole?.slug === "super_admin",
    isSchoolAdmin: currentRole?.slug === "school_admin",
    isAdmin: ["super_admin", "school_admin"].includes(currentRole?.slug ?? ""),
    isLoading,
  };
}
