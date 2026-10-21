"use client";

import { LuChevronDown } from "react-icons/lu";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import type { PermissionDataDto } from "@/app/api/schemas";
import type { RolePermissionsSectionProps } from "@/types/role";

function groupPermissions(permissions: PermissionDataDto[]) {
  const groups = new Map<string, Map<string, PermissionDataDto[]>>();

  for (const permission of permissions) {
    let modules = groups.get(permission.group);
    if (!modules) {
      modules = new Map();
      groups.set(permission.group, modules);
    }

    const actions = modules.get(permission.module) ?? [];
    actions.push(permission);
    modules.set(permission.module, actions);
  }

  return Array.from(groups, ([name, modules]) => ({
    name,
    modules: Array.from(modules, ([name, modulePermissions]) => ({
      name,
      permissions: modulePermissions,
    })),
  }));
}

export default function RolePermissionsSection({
  permissions,
  permissionKeys,
  onPermissionKeysChange,
  isLoading,
  error,
  onRetry,
  disabled,
}: RolePermissionsSectionProps) {
  const groups = groupPermissions(permissions);

  function togglePermission(key: string) {
    onPermissionKeysChange(
      permissionKeys.includes(key)
        ? permissionKeys.filter((permissionKey) => permissionKey !== key)
        : [...permissionKeys, key],
    );
  }

  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby="role-permissions-title"
    >
      <div className="">
        <h2
          id="role-permissions-title"
          className="text-lg font-extrabold text-dark"
        >
          Permissions
        </h2>

        <p className="text-xs text-gray">
          Select a permission to turn it on or off for this role. Filled buttons
          are on.
        </p>
      </div>
      {Boolean(error) && (
        <div>
          <Alert
            type="error"
            role="alert"
            message="Unable to load permissions."
          />
          <Button variant="link" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
      {groups.map((group) => (
        <details
          key={group.name}
          // open={group.name === "People"}
          className="group overflow-hidden rounded-lg border border-border bg-background"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-base font-extrabold text-dark focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
            {group.name}
            <LuChevronDown
              className="transition-transform group-open:rotate-180"
              size={18}
              aria-hidden="true"
            />
          </summary>
          <div className="border-t border-border px-5">
            {group.modules.map((module) => (
              <div
                key={module.name}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3 last:border-b-0"
              >
                <span className="font-semibold text-dark">{module.name}</span>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label={`${module.name} permissions`}
                >
                  {module.permissions.map((permission) => {
                    const enabled = permissionKeys.includes(permission.key);
                    return (
                      <Button
                        key={permission.key}
                        variant={enabled ? "primary" : "secondary"}
                        className="h-8! rounded-full! px-3! text-xs!"
                        ariaPressed={enabled}
                        disabled={disabled}
                        onClick={() => togglePermission(permission.key)}
                      >
                        {permission.action}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </details>
      ))}
    </section>
  );
}
