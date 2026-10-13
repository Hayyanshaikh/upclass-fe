import type { Metadata } from "next";
import { Suspense } from "react";
import MarksEntry from "@/components/exams/MarksEntry";

export const metadata: Metadata = { title: "Marks entry | UPCLASS" };

export default function MarksEntryPage() {
  return (
    <Suspense fallback={<p role="status" className="text-sm text-gray">Loading marks entry…</p>}>
      <MarksEntry />
    </Suspense>
  );
}
