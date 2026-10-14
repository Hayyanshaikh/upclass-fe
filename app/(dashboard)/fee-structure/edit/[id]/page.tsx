import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditFeeStructureForm from "@/components/forms/EditFeeStructureForm";

export const metadata: Metadata = { title: "Edit fee structure | UPCLASS" };

export default function EditFeeStructurePage() {
  return <div>
    <PageHeader title="Edit fee structure" breadcrumbs={[{ title: "Fee structure", href: "/fee-structure" }, { title: "Edit" }]} />
    <Suspense fallback={<p role="status" className="text-sm text-gray">Loading fee structure...</p>}>
      <EditFeeStructureForm />
    </Suspense>
  </div>;
}
