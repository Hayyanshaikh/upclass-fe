import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import FeeStructureForm from "@/components/forms/FeeStructureForm";

export const metadata: Metadata = { title: "Add fee structure | UPCLASS" };

export default function AddFeeStructurePage() {
  return <div>
    <PageHeader
      title="Add fee structure"
      subtitle="Update uses the same form with fields prefilled and the title “Edit fee structure”."
      breadcrumbs={[{ title: "Fee structure", href: "/fee-structure" }, { title: "Add" }]}
    />
    <FeeStructureForm />
  </div>;
}
