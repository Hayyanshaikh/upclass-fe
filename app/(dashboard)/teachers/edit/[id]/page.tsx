import type { Metadata } from "next";
import { Suspense } from "react";
import EditTeacherForm from "@/components/forms/EditTeacherForm";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = { title: "Edit teacher | UPCLASS" };

export default function EditTeacherRoute() {
  return (
    <Suspense fallback={<Loader />}>
      <EditTeacherForm />
    </Suspense>
  );
}
