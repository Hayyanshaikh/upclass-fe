import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditClassForm from "@/components/forms/EditClassForm";

export const metadata: Metadata = { title: "Edit class | UPCLASS" };

export default function EditClassPage() {
  return (
    <div>
      <PageHeader title="Edit class" breadcrumbs={[{ title: "Classes", href: "/classes" }, { title: "Edit class" }]} />
      <Suspense fallback={<p role="status" className="text-sm text-gray">Loading class details...</p>}>
        <EditClassForm />
      </Suspense>
    </div>
  );
}
