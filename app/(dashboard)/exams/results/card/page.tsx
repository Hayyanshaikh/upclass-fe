import type { Metadata } from "next";
import { Suspense } from "react";
import ResultCard from "@/components/exams/ResultCard";

export const metadata: Metadata = { title: "Result card | UPCLASS" };

export default function ResultCardPage() {
  return (
    <Suspense fallback={<p role="status" className="text-sm text-gray">Loading result card…</p>}>
      <ResultCard />
    </Suspense>
  );
}
