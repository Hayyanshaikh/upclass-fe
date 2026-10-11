import type { LogoProps } from "@/types/logo";
import { LuGraduationCap } from "react-icons/lu";

const sizes = {
  sm: { container: "gap-2 text-base", badge: "size-8 rounded-sm", icon: 18 },
  md: { container: "gap-3 text-xl", badge: "size-11 rounded-[14px]", icon: 24 },
  lg: { container: "gap-4 text-2xl", badge: "size-14 rounded-lg", icon: 30 },
};

export default function Logo({ size = "md", className = "", subtitle }: LogoProps) {
  const styles = sizes[size];

  return (
    <div className={`flex items-center font-extrabold ${styles.container} ${className}`}>
      <span className={`flex shrink-0 items-center justify-center bg-secondary text-dark ${styles.badge}`}>
        <LuGraduationCap size={styles.icon} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span>UPCLASS</span>
        {subtitle && <span className="text-[10px] leading-tight font-normal">{subtitle}</span>}
      </span>
    </div>
  );
}
