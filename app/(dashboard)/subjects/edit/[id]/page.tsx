import type { Metadata } from "next";
import { Suspense } from "react";
import EditSubjectForm from "@/components/forms/EditSubjectForm";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = { title: "Edit subject | UPCLASS" };

export default function EditSubjectPage() {
  return (
    <Suspense fallback={<Loader />}>
      <EditSubjectForm />
    </Suspense>
  );
}
