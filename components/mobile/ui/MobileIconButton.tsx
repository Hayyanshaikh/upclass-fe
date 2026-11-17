import type { ReactNode } from "react";
import Link from "next/link";

type MobileIconButtonVariant =
  | "appBar"
  | "secondary"
  | "ghost"
  | "danger"
  | "fab";

type MobileIconButtonProps = {
  label: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: MobileIconButtonVariant;
  className?: string;
};

const baseClassName =
  "flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-80";

const variants: Record<MobileIconButtonVariant, string> = {
  appBar:
    "border border-background/25 bg-background/10 focus-visible:outline-secondary",
  secondary:
    "border border-border bg-background text-dark focus-visible:outline-primary",
  ghost:
    "min-h-auto! min-w-auto! text-gray focus-visible:outline-primary active:bg-foreground",
  danger:
    "border border-danger/40 bg-background text-danger focus-visible:outline-danger",
  fab: "fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-20 size-14! rounded-full! border-0 bg-primary text-background shadow-lg shadow-primary/30 focus-visible:outline-primary",
};

export default function IconButton({
  label,
  children,
  href,
  onClick,
  variant = "appBar",
  className = "",
}: MobileIconButtonProps) {
  const buttonClassName = `${baseClassName} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} aria-label={label} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={buttonClassName}
    >
      {children}
    </button>
  );
}
