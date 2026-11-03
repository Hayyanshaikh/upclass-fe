import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditSchoolForm from "@/components/forms/EditSchoolForm";

export const metadata: Metadata = { title: "Edit school | UPCLASS" };

export default function EditSchoolPage() {
  return (
    <div>
      <Suspense
        fallback={
          <p role="status" className="text-sm text-gray">
            Loading school details...
          </p>
        }
      >
        <EditSchoolForm />
      </Suspense>
    </div>
  );
}
