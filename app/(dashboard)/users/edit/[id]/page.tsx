import type { Metadata } from "next";
import { Suspense } from "react";
import EditUserForm from "@/components/forms/EditUserForm";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = { title: "Edit user | UPCLASS" };

export default function EditUserRoute() {
  return (
    <Suspense fallback={<Loader />}>
      <EditUserForm />
    </Suspense>
  );
}
