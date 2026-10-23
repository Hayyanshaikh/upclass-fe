"use client";

import { LoginResponseUserDto } from "@/app/api/schemas";
import { useStorageStore } from "@/stores/storage";

export function useRolePermission(module: string) {
  const user = useStorageStore((state) => state.values.user) as
    | LoginResponseUserDto
    | undefined;

  const permissions =
    user?.role?.permissions?.map((permission) => permission.key) ?? [];

  const viewPermission = permissions.includes(`${module}.view`);
  const addPermission = permissions.includes(`${module}.create`);
  const editPermission = permissions.includes(`${module}.edit`);
  const deletePermission = permissions.includes(`${module}.delete`);

  return {
    canView: viewPermission,
    canCreate: addPermission,
    canEdit: editPermission,
    canDelete: deletePermission,
    showActions: viewPermission || editPermission || deletePermission,
  };
}
