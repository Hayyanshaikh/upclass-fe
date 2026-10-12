import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditTeacherForm from "@/components/forms/EditTeacherForm";

export const metadata: Metadata = { title: "Edit teacher | UPCLASS" };

export default function EditTeacherPage() {
  return (
    <div>
      <PageHeader title="Edit teacher" breadcrumbs={[{ title: "Teachers", href: "/teachers" }, { title: "Edit teacher" }]} />
      <Suspense fallback={<p role="status" className="text-sm text-gray">Loading teacher details...</p>}>
        <EditTeacherForm />
      </Suspense>
    </div>
  );
}
