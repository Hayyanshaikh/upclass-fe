"use client";

import type { LayoutProps } from "@/types/layout";
import Sidebar from "@/components/layout/Sidebar";
import MobileAppBar from "@/components/mobile/layout/MobileAppBar";
import MobileBottomNav from "@/components/mobile/layout/MobileBottomNav";
import { useIsMobile } from "@/hooks/useIsMobile";
import Loader from "@/components/ui/Loader";

export default function DashboardLayout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return <Loader />;
  }

  if (isMobile) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden bg-foreground text-dark">
        <MobileAppBar />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-foreground text-dark lg:flex-row">
      <Sidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-7 sm:pt-5">
          {children}
        </main>
      </div>
    </div>
  );
}
