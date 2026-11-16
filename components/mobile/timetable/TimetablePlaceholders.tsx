"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

export function NoticeCard({ children }: { children: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background px-6 py-8 text-center">
      <p className="text-sm leading-5 text-gray">{children}</p>
    </div>
  );
}

export function SetupCard({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-background px-6 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </span>
      <h2 className="mt-4 text-sm font-bold text-dark">{title}</h2>
      <p className="mt-1.5 text-xs leading-5 text-gray">{description}</p>
      <Link
        href={action.href}
        className="mt-4 inline-flex min-h-10 items-center justify-center gap-1 rounded-md bg-foreground px-4 text-xs font-semibold text-primary active:opacity-80"
      >
        {action.label}
        <LuChevronRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}
