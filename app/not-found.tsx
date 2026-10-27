"use client";

import { LuSearchX } from "react-icons/lu";
import ErrorScreen from "@/components/shared/ErrorScreen";

/**
 * 404 – Not Found screen.
 *
 * Follows the Upclass design system:
 *  - Uses Tailwind utility classes only (no hard‑coded colors).
 *  - Uses semantic tokens: `text-danger`, `bg-background`, `border-border`.
 *  - Reuses the shared `PageHeader` and `Button` components.
 */
export default function NotFoundPage() {
  return (
    <ErrorScreen
      code={404}
      title="Page Not Found"
      description="This page doesn't exist or may have been moved."
      icon={<LuSearchX size={42} />}
      actionLabel="Go Home"
      actionHref="/"
    />
  );
}
