import type { LayoutProps } from "@/types/layout";
import { LuMenu } from "react-icons/lu";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="h-dvh overflow-hidden bg-foreground text-dark lg:flex">
      <div className="hidden h-full w-62.5 shrink-0 lg:block">
        <Sidebar />
      </div>

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <details className="mb-4 shrink-0 rounded-lg bg-primary text-white lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-secondary [&::-webkit-details-marker]:hidden">
            <LuMenu size={20} aria-hidden="true" />
            Navigation
          </summary>
          <div className="h-[min(820px,80dvh)]">
            <Sidebar />
          </div>
        </details>
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-7 pt-5">
          {children}
        </main>
      </div>
    </div>
  );
}
