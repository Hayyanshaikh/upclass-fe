"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNavItems } from "@/constants/mobile-nav";
import { useStorageStore } from "@/stores/storage";
import type { LoginResponseUserDto } from "@/app/api/schemas";

type MobileNavItemProps = {
  item: (typeof mobileNavItems)[number];
  pathname: string;
};

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function MobileNavItem({ item, pathname }: MobileNavItemProps) {
  const Icon = item.icon;
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      className={`flex min-h-14 flex-1 flex-col items-center justify-end gap-0.5 text-xs font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary active:opacity-70 ${
        active ? "text-primary" : "text-gray"
      }`}
    >
      <span
        className={`flex  items-center justify-center rounded-full ${
          active ? "bg-primary text-white size-10 p-2" : "size-8"
        }`}
      >
        <Icon size={20} />
      </span>

      {item.label}
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  const user = useStorageStore((state) => state.values.user) as
    | LoginResponseUserDto
    | undefined;

  const permissions =
    user?.role?.permissions?.map((permission) => permission.key) ?? [];

  const items = mobileNavItems.filter((item) =>
    permissions.includes(item.permission),
  );

  return (
    <nav className="shrink-0 border-t pb-2 border-border bg-background">
      <div className="flex min-h-16">
        {items.map((item) => (
          <MobileNavItem key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}
