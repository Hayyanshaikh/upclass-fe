"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { LuBell, LuLogOut, LuSchool, LuUserRound } from "react-icons/lu";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import { useStorageStore } from "@/stores/storage";
import type { LoginResponseUserDto } from "@/app/api/schemas";

export default function MobileAppBar() {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const user = useStorageStore((state) => state.values.user) as
    | LoginResponseUserDto
    | undefined;
  const deleteValue = useStorageStore((state) => state.deleteValue);

  const name = user?.name ?? "Admin";
  const schoolName = user?.school?.name;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    Cookies.remove("accessToken", { path: "/" });
    deleteValue("user");
    setLogoutOpen(false);
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      <header className="shrink-0 rounded-b-2xl bg-primary px-4 pt-[env(safe-area-inset-top)] text-background">
        <div className="flex items-center gap-3 py-4">
          <IconButton
            href="/settings"
            label="Open profile and settings"
            className="size-11 text-sm font-extrabold"
          >
            {initials || <LuUserRound size={20} aria-hidden="true" />}
          </IconButton>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-light">Welcome back</p>
            <p className="truncate text-lg leading-6 font-extrabold">{name}</p>

            {schoolName && (
              <span className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full bg-background/10 px-2.5 py-1 text-xs font-semibold">
                <LuSchool size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{schoolName}</span>
              </span>
            )}
          </div>

          <IconButton href="/notices" label="View notices" className="relative">
            <LuBell size={20} aria-hidden="true" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-secondary ring-2 ring-primary" />
          </IconButton>

          <IconButton label="Log out" onClick={() => setLogoutOpen(true)}>
            <LuLogOut size={20} aria-hidden="true" />
          </IconButton>
        </div>
      </header>

      <MobileConfirmDialog
        open={logoutOpen}
        title="Log out?"
        description="Are you sure you want to log out of your account?"
        confirmText="Log out"
        cancelText="Cancel"
        danger
        onConfirm={handleLogout}
        onClose={() => setLogoutOpen(false)}
      />
    </>
  );
}
