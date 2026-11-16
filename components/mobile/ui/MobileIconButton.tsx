import type { ReactNode } from "react";
import Link from "next/link";

type MobileIconButtonProps = {
  label: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
};

const baseClassName =
  "flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-background/25 bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary active:opacity-80";

export default function IconButton({
  label,
  children,
  href,
  onClick,
  className = "",
}: MobileIconButtonProps) {
  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        className={`${baseClassName} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`${baseClassName} ${className}`}
    >
      {children}
    </button>
  );
}
