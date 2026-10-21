"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer, Tooltip } from "antd";
import Cookies from "js-cookie";
import { LuLogOut, LuMenu, LuX } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Logo from "@/components/shared/Logo";
import { menuItems } from "@/constants/menu";
import type { MenuItemProps } from "@/types/sidebar";
import { useStorageStore } from "@/stores/storage";
import type { LoginResponseUserDto } from "@/app/api/schemas";
import { useUserControllerFindOne } from "@/app/api/endpoints";

function SidebarHeader({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="UPCLASS dashboard"
      className="pb-3 border-b border-border-light mx-1 mb-3 text-white! hover:text-white! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
    >
      <Logo size="sm" subtitle="Management System" className="text-sm" />
    </Link>
  );
}

function MenuItem({ item, active, onNavigate }: MenuItemProps) {
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
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-11 items-center gap-3 rounded-sm px-3.5 py-0 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${active ? "bg-white! text-primary! hover:bg-white! hover:text-primary!" : "text-light! hover:bg-white/10! hover:text-white!"}`}
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

function SidebarMenu({
  user,
  isLoading,
  isError,
  onNavigate,
}: {
  user?: LoginResponseUserDto;
  isLoading: boolean;
  isError: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeHref = menuItems.reduce((current, item) => {
    const matches =
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`));
    return matches && item.href.length > current.length ? item.href : current;
  }, "");

  const permissionKeys =
    user?.role?.permissions?.map((permission) => permission.key) ?? [];

  const filteredMenuItems = menuItems.filter((item) =>
    permissionKeys.includes(item.permission),
  );

  return (
    <nav
      className="min-h-0 flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto overscroll-contain pr-1 [--scrollbar-thumb:#c9ddd566] [--scrollbar-thumb-hover:#c9ddd599]"
      aria-label="Dashboard navigation"
    >
      {isLoading ? (
        <div
          className="space-y-8 px-3 py-4"
          role="status"
          aria-label="Loading menu permissions"
        >
          <span className="sr-only">Loading menu...</span>
          {menuItems.slice(0, 10).map((item) => (
            <div
              key={item.href}
              className="flex animate-pulse items-center gap-3"
              aria-hidden="true"
            >
              <span className="size-4 rounded-sm bg-white/15" />
              <span className="h-3 w-3/5 rounded-sm bg-white/15" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <p role="alert" className="px-3 py-4 text-sm text-light">
          Unable to load menu permissions.
        </p>
      ) : (
        filteredMenuItems.map((item) => (
          <MenuItem
            key={item.href}
            item={item}
            active={item.href === activeHref}
            onNavigate={onNavigate}
          />
        ))
      )}
    </nav>
  );
}

function SidebarProfile({
  user,
  onLogout,
  showLogout = true,
}: {
  user?: LoginResponseUserDto;
  onLogout: () => void;
  showLogout?: boolean;
}) {
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
      {showLogout && (
        <Tooltip title="Log out" placement="top">
          <span className="ml-auto inline-flex shrink-0">
            <Button
              variant="text"
              className="size-8! shrink-0 rounded-sm! p-0! text-light! transition hover:bg-white/10! hover:text-white! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              onClick={onLogout}
            >
              <LuLogOut size={18} aria-hidden="true" />
              <span className="sr-only">Log out</span>
            </Button>
          </span>
        </Tooltip>
      )}
    </div>
  );
}

function SidebarContent({
  user,
  isLoading,
  isError,
  onNavigate,
  onLogout,
  showLogout,
  showHeader = true,
}: {
  user?: LoginResponseUserDto;
  isLoading: boolean;
  isError: boolean;
  onNavigate?: () => void;
  onLogout: () => void;
  showLogout?: boolean;
  showHeader?: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-primary px-3 pt-5 pb-4 text-white">
      {showHeader && <SidebarHeader onNavigate={onNavigate} />}
      <SidebarMenu
        user={user}
        isLoading={isLoading}
        isError={isError}
        onNavigate={onNavigate}
      />
      <SidebarProfile user={user} onLogout={onLogout} showLogout={showLogout} />
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const deleteValue = useStorageStore((state) => state.deleteValue);
  const storedUser = useStorageStore((state) => state.values.user) as
    | LoginResponseUserDto
    | undefined;
  const setValue = useStorageStore((state) => state.setValue);
  const userId = storedUser?.id ?? "";
  const {
    data: userData,
    isPending,
    isFetching,
    isError,
  } = useUserControllerFindOne(userId, {
    query: {
      enabled: Boolean(userId),
      refetchOnMount: "always",
    },
  });
  const user = userData?.data ?? storedUser;
  const isPermissionsLoading = !userId || isPending || isFetching;

  useEffect(() => {
    if (userData?.data) {
      setValue("user", userData.data);
    }
  }, [setValue, userData]);

  const handleLogout = () => {
    Cookies.remove("accessToken", { path: "/" });
    deleteValue("user");
    setLogoutDialogOpen(false);
    setMenuOpen(false);
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      <header className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-3 text-dark lg:hidden">
        <Button
          variant="text"
          className="size-10! shrink-0 p-0! text-dark! hover:bg-action-hover!"
          onClick={() => setMenuOpen(true)}
        >
          <LuMenu size={22} aria-hidden="true" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
        <Link href="/" aria-label="UPCLASS dashboard" className="min-w-0 text-dark! hover:text-dark!">
          <Logo size="sm" />
        </Link>
        <Button
          variant="text"
          className="ml-auto size-10! shrink-0 p-0! text-danger! hover:bg-transparent! hover:text-danger!"
          onClick={() => setLogoutDialogOpen(true)}
        >
          <LuLogOut size={18} aria-hidden="true" />
          <span className="sr-only">Log out</span>
        </Button>
      </header>

      <aside className="hidden h-full w-62.5 shrink-0 lg:block">
        <SidebarContent
          user={user}
          isLoading={isPermissionsLoading}
          isError={isError}
          onLogout={() => setLogoutDialogOpen(true)}
        />
      </aside>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        placement="left"
        width="min(18rem, 85vw)"
        title={<Logo size="sm" className="text-white" />}
        closable={false}
        extra={
          <Button
            variant="text"
            className="size-9! p-0! text-white! hover:bg-white/10! hover:text-white!"
            onClick={() => setMenuOpen(false)}
          >
            <LuX size={20} aria-hidden="true" />
            <span className="sr-only">Close navigation menu</span>
          </Button>
        }
        classNames={{
          header: "bg-primary! border-border-light! text-white!",
          title: "text-white!",
          body: "p-0!",
        }}
        rootClassName="lg:hidden"
      >
        <SidebarContent
          user={user}
          isLoading={isPermissionsLoading}
          isError={isError}
          onNavigate={() => setMenuOpen(false)}
          onLogout={() => setLogoutDialogOpen(true)}
          showLogout={false}
          showHeader={false}
        />
      </Drawer>

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
    </>
  );
}
