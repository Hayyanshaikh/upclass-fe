import LoginBranding from "@/components/layout/LoginBranding";
import type { LayoutProps } from "@/types/layout";

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="grid h-dvh bg-foreground lg:grid-cols-[48%_52%]">
      <LoginBranding />
      <section
        className="flex items-center justify-center"
        aria-labelledby="login-heading"
      >
        {children}
      </section>
    </main>
  );
};

export default Layout;
