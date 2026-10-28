import type { LayoutProps } from "@/types/layout";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: LayoutProps) {
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
