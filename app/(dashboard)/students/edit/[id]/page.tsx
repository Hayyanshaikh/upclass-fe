import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditStudentForm from "@/components/forms/EditStudentForm";

export const metadata: Metadata = {
  title: "Edit student | UPCLASS",
};

export default function EditStudentPage() {
  return (
    <div>
      <PageHeader
        title="Edit student"
        breadcrumbs={[
          { title: "Students", href: "/students" },
          { title: "Edit student" },
        ]}
      />
      <Suspense
        fallback={
          <p role="status" className="text-sm text-gray">
            Loading student details...
          </p>
        }
      >
        <EditStudentForm />
      </Suspense>
    </div>
  );
}
