import type { Metadata } from "next";
import { Suspense } from "react";
import FeeReceipt from "@/components/fees/FeeReceipt";

export const metadata: Metadata = { title: "Fee receipt | UPCLASS" };

export default function FeeReceiptPage() {
  return (
    <Suspense fallback={<p role="status" className="text-sm text-gray">Loading receipt...</p>}>
      <FeeReceipt />
    </Suspense>
  );
}
