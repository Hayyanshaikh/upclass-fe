import { LuGraduationCap } from "react-icons/lu";
import LoginBranding from "@/components/layout/LoginBranding";
import type { LayoutProps } from "@/types/layout";

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="flex min-h-dvh flex-col bg-primary lg:grid lg:h-dvh lg:grid-cols-[48%_52%] lg:bg-foreground">
      <LoginBranding />

      <section className="flex flex-1 flex-col lg:items-center lg:justify-center">
        <header className="flex flex-col items-center px-6 pt-10 pb-8 text-center lg:hidden">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-dark">
            <LuGraduationCap size={30} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-[26px] leading-tight font-extrabold tracking-[-0.025em] text-white">
            UPCLASS
          </h1>
          <p className="mt-1 text-sm text-white/70">School Management System</p>
        </header>

        {children}
      </section>
    </main>
  );
};

export default Layout;
