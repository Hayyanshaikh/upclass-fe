import type { Metadata } from "next";
import { Suspense } from "react";
import Results from "@/components/exams/Results";

export const metadata: Metadata = { title: "Results | UPCLASS" };

export default function ResultsPage() {
  return (
    <Suspense fallback={<p role="status" className="text-sm text-gray">Loading results…</p>}>
      <Results />
    </Suspense>
  );
}
