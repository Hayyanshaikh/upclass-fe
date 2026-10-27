"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 401 – Unauthorized screen.
 *
 * This page is displayed when an API returns a 401 that is not handled by the
 * global interceptor (e.g., when a component manually redirects on an auth error).
 * It follows the Upclass design system, reusing existing token classes.
 */
export default function UnauthorizedPage() {
  const router = useRouter();

  // If a user lands here directly, send them to the login page after a short delay.
  useEffect(() => {
    const timer = setTimeout(() => router.replace("/login"), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-8 p-6 bg-background text-dark">
      <h2 className="text-2xl font-semibold text-danger">401 – Unauthorized</h2>
      <p className="max-w-md text-center text-gray">
        Your session has expired or you do not have permission to view this
        content.
      </p>
    </div>
  );
}
