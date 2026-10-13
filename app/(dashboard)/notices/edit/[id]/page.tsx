import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditNoticeForm from "@/components/forms/EditNoticeForm";

export const metadata: Metadata = { title: "Edit notice | UPCLASS" };

export default function EditNoticePage() {
  return (
    <div>
      <PageHeader title="Edit notice" breadcrumbs={[{ title: "Notices", href: "/notices" }, { title: "Edit" }]} />
      <Suspense fallback={<p role="status" className="text-sm text-gray">Loading notice…</p>}>
        <EditNoticeForm />
      </Suspense>
    </div>
  );
}
