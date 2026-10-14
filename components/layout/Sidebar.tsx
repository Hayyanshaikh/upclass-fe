"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import Logo from "@/components/shared/Logo";
import { menuItems } from "@/constants/menu";
import type { MenuItemProps } from "@/types/sidebar";

function SidebarHeader() {
  return (
    <Link
      href="/"
      aria-label="UPCLASS dashboard"
      className="pb-3 border-b border-border-light mx-1 mb-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
    >
      <Logo size="sm" subtitle="Management System" className="text-sm" />
    </Link>
  );
}

function MenuItem({ item, active }: MenuItemProps) {
  const Icon = item.icon;

  return (
    <div>
      {item.group && (
        <p className="mt-4 mb-2 px-3 text-[11px] font-extrabold tracking-wide text-light uppercase">
          {item.group}
        </p>
      )}
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-11 items-center gap-3 rounded-sm px-3.5 py-0 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${active ? "bg-white text-primary" : "text-light hover:bg-white/10 hover:text-white"}`}
      >
        <Icon size={18} className="shrink-0" aria-hidden="true" />
        <span>{item.label}</span>
        {item.badge !== undefined && (
          <span
            className="ml-auto flex size-4.5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-dark"
            aria-label={`${item.badge} pending requests`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    </div>
  );
}

function SidebarMenu() {
  const pathname = usePathname();
  const activeHref = menuItems.reduce((current, item) => {
    const matches =
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`));
    return matches && item.href.length > current.length ? item.href : current;
  }, "");

  return (
    <nav
      className="min-h-0 flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto overscroll-contain pr-1 [--scrollbar-thumb:#c9ddd566] [--scrollbar-thumb-hover:#c9ddd599]"
      aria-label="Dashboard navigation"
    >
      {menuItems.map((item) => (
        <MenuItem
          key={item.href}
          item={item}
          active={item.href === activeHref}
        />
      ))}
    </nav>
  );
}

function SidebarProfile() {
  return (
    <div className="mt-2 flex shrink-0 items-center gap-2.5 border-t border-border-light px-2 pt-3">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-light text-sm font-bold text-primary"
        aria-hidden="true"
      >
        A
      </span>
      <div className="min-w-0 text-xs leading-4">
        <p className="truncate font-bold">[Admin Name]</p>
        <p className="text-[10px] text-light">Super admin</p>
      </div>
      <span className="group relative ml-auto inline-flex shrink-0">
        <Link
          href="/login"
          replace
          aria-label="Log out"
          className="flex size-8 items-center justify-center rounded-sm text-light transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <LuLogOut size={18} aria-hidden="true" />
        </Link>
        <span
          aria-hidden="true"
          className="pointer-events-none invisible absolute right-0 bottom-full z-10 mb-2 whitespace-nowrap rounded-sm border border-border bg-dark px-2 py-1 text-xs font-medium text-light opacity-0 shadow-sm transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        >
          Log out
        </span>
      </span>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col bg-primary px-3 pt-5 pb-4 text-white">
      <SidebarHeader />
      <SidebarMenu />
      <SidebarProfile />
    </aside>
  );
}
