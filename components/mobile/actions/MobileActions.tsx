"use client";

import Link from "next/link";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSection from "@/components/mobile/ui/MobileSection";
import { menuItems } from "@/constants/menu";
import { useStorageStore } from "@/stores/storage";
import type { LoginResponseUserDto } from "@/app/api/schemas";
import type { NavItem } from "@/types/menu";

function groupActions(actions: NavItem[]) {
  return actions.reduce(
    (groups, action) => {
      const groupName = action.group || "Other";

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push(action);
      return groups;
    },
    {} as Record<string, NavItem[]>,
  );
}

export default function MobileActions() {
  const user = useStorageStore((state) => state.values.user) as
    | LoginResponseUserDto
    | undefined;

  const permissions =
    user?.role?.permissions?.map((permission) => permission.key) ?? [];

  const groupedActions = groupActions(
    menuItems.filter((item) => permissions.includes(item.permission)),
  );

  const groups = Object.entries(groupedActions);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <IconButton variant="ghost" href="/" label="Back to dashboard">
          <LuChevronLeft size={22} aria-hidden="true" />
        </IconButton>
        <h1 className="text-lg font-bold text-dark">All actions</h1>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-lg border border-border bg-background p-6 text-center text-sm text-gray">
          No actions are available for your role.
        </p>
      ) : (
        groups.map(([groupName, actions]) => (
          <MobileSection key={groupName} title={groupName}>
            <ul role="list" className="flex flex-col">
              {actions.map((action) => {
                const Icon = action.icon;

                return (
                  <li key={action.href}>
                    <Link
                      href={action.href}
                      className="flex min-h-12 items-center gap-3 rounded-md px-1 text-sm font-semibold text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {action.label}
                      </span>
                      {action.badge !== undefined && (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-dark">
                          {action.badge}
                        </span>
                      )}
                      <LuChevronRight
                        size={16}
                        className="shrink-0 text-gray"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </MobileSection>
        ))
      )}
    </div>
  );
}
