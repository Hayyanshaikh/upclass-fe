import type { Metadata } from "next";
import { Suspense } from "react";
import EditClassForm from "@/components/forms/EditClassForm";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = { title: "Edit class | UPCLASS" };

export default function EditClassRoute() {
  return (
    <Suspense fallback={<Loader />}>
      <EditClassForm />
    </Suspense>
  );
}
