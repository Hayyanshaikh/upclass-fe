"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import Cookies from "js-cookie";
import { LuLogOut } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Logo from "@/components/shared/Logo";
import { menuItems } from "@/constants/menu";
import type { MenuItemProps } from "@/types/sidebar";
import { useStorageStore } from "@/stores/storage";
import { LoginResponseUserDto } from "@/app/api/schemas";
import { useUserControllerFindOne } from "@/app/api/endpoints";

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
  const { user } = useStorageStore((state) => state.values);
  const pathname = usePathname();
  const activeHref = menuItems.reduce((current, item) => {
    const matches =
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`));
    return matches && item.href.length > current.length ? item.href : current;
  }, "");

  const permissionKeys =
    (user as LoginResponseUserDto | undefined)?.role?.permissions?.map(
      (permission) => permission.key,
    ) ?? [];

  const filteredMenuItems = menuItems.filter((item) =>
    permissionKeys.includes(item.permission),
  );

  return (
    <nav
      className="min-h-0 flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto overscroll-contain pr-1 [--scrollbar-thumb:#c9ddd566] [--scrollbar-thumb-hover:#c9ddd599]"
      aria-label="Dashboard navigation"
    >
      {filteredMenuItems.map((item) => (
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
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { deleteValue, setValue, values } = useStorageStore();

  const user = values.user as LoginResponseUserDto | undefined;
  const userId = user?.id ?? "";

  const { data: userData } = useUserControllerFindOne(userId, {
    query: {
      enabled: !!userId,
    },
  });

  const userResponse: LoginResponseUserDto | undefined = userData?.data;

  useEffect(() => {
    if (userData) {
      setValue("user", userResponse!);
    }
  }, [userData, setValue]);

  const handleLogout = () => {
    Cookies.remove("accessToken", { path: "/" });
    deleteValue("user");
    setLogoutDialogOpen(false);
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="mt-2 flex shrink-0 items-center gap-2.5 border-t border-border-light px-2 pt-3">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-light text-sm font-bold text-primary"
        aria-hidden="true"
      >
        {user?.name?.charAt(0)}
      </span>
      <div className="min-w-0 text-xs leading-4">
        <p className="truncate font-bold">{user?.name}</p>
        <p className="text-[10px] text-light">{user?.role?.name}</p>
      </div>
      <Tooltip title="Log out" placement="top">
        <span className="ml-auto inline-flex shrink-0">
          <Button
            variant="text"
            className="size-8! shrink-0 rounded-sm! p-0! text-light! transition hover:bg-white/10! hover:text-white! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <LuLogOut size={18} aria-hidden="true" />
            <span className="sr-only">Log out</span>
          </Button>
        </span>
      </Tooltip>
      <Dialog
        open={logoutDialogOpen}
        title="Log out?"
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        okText="Log out"
        cancelText="Cancel"
        confirmDanger
        closable={false}
        width={400}
      >
        <p className="text-sm text-dark">
          Are you sure you want to log out of your account?
        </p>
      </Dialog>
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
