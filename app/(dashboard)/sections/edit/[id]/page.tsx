import type { Metadata } from "next";
import { Suspense } from "react";
import EditSectionForm from "@/components/forms/EditSectionForm";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = { title: "Edit section | UPCLASS" };

export default function EditSectionPage() {
  return (
    <Suspense fallback={<Loader />}>
      <EditSectionForm />
    </Suspense>
  );
}
