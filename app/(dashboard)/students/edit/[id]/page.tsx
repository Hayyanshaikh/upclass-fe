import type { Metadata } from "next";
import { Suspense } from "react";
import EditStudentForm from "@/components/forms/EditStudentForm";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "Edit student | UPCLASS",
};

export default function EditStudentPage() {
  return (
    <Suspense fallback={<Loader />}>
      <EditStudentForm />
    </Suspense>
  );
}
