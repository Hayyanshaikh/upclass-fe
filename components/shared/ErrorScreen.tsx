"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { ErrorScreenProps } from "@/types/error-screen";

export default function ErrorScreen({
  code,
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  fallbackHref = "/",
}: ErrorScreenProps) {
  const router = useRouter();

  const handleAction = () => {
    if (actionHref) {
      router.push(actionHref);
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-foreground px-4 py-10 text-center"
      aria-labelledby="error-screen-title"
    >
      <div className="flex max-w-lg flex-col items-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-danger/10 text-danger">
          {icon}
        </div>

        <p className="mt-5 rounded-full bg-danger/10 px-3 py-1 text-xs font-extrabold tracking-wide text-danger">
          ERROR {code}
        </p>

        <h1
          id="error-screen-title"
          className="mt-6 text-3xl font-extrabold tracking-tight text-dark sm:text-4xl"
        >
          {title}
        </h1>

        <p className="mt-5 text-base text-gray sm:text-lg">{description}</p>

        <Button onClick={handleAction} className="mt-7 px-6!">
          {actionLabel}
        </Button>
      </div>
    </section>
  );
}
