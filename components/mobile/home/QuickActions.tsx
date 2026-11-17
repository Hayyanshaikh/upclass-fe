"use client";

import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import MobileSection from "@/components/mobile/ui/MobileSection";
import { quickActions } from "@/constants/mobile-dashboard";
import { useStorageStore } from "@/stores/storage";
import type { LoginResponseUserDto } from "@/app/api/schemas";
import { NavItem } from "@/types/menu";

function ActionList({ actions }: { actions: NavItem[] }) {
  return (
    <ul className="grid grid-cols-3 gap-x-2 gap-y-4">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <li key={action.href}>
            <Link
              href={action.href}
              className="flex min-h-14 flex-col items-center gap-2 rounded-md text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-70"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-md ${
                  action.featured
                    ? "bg-primary text-background"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="text-xs leading-4 font-semibold text-dark">
                {action.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function QuickActions() {
  const user = useStorageStore((state) => state.values.user) as
    | LoginResponseUserDto
    | undefined;

  const permissions =
    user?.role?.permissions?.map((permission) => permission.key) ?? [];

  const actions = quickActions.filter((action) =>
    permissions.includes(action.permission),
  );

  return (
    <MobileSection
      title="Quick actions"
      hint={
        <Link
          href="/actions"
          className="inline-flex items-center gap-0.5 text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          See all
          <LuChevronRight size={14} aria-hidden="true" />
        </Link>
      }
    >
      {actions.length === 0 ? (
        <p className="text-xs text-gray">
          No quick actions are available for your role.
        </p>
      ) : (
        <ActionList actions={actions} />
      )}
    </MobileSection>
  );
}
