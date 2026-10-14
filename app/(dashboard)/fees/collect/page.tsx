import type { Metadata } from "next";
import { Suspense } from "react";
import CollectFee from "@/components/fees/CollectFee";
import PageHeader from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Collect fee | UPCLASS" };

export default function CollectFeePage() {
  return <div>
    <PageHeader
      title="Collect fee"
      subtitle="Record a payment and generate a receipt"
      breadcrumbs={[{ title: "Fees", href: "/fees" }, { title: "Collect" }]}
    />
    <Suspense fallback={<p role="status" className="text-sm text-gray">Loading payment form...</p>}>
      <CollectFee />
    </Suspense>
  </div>;
}
