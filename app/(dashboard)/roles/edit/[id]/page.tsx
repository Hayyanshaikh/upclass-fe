import type { Metadata } from "next";
import { Suspense } from "react";
import EditRoleForm from "@/components/forms/EditRoleForm";

export const metadata: Metadata = { title: "Edit role | UPCLASS" };

export default function EditRoleRoute() {
  return (
    <Suspense fallback={<p role="status" className="text-sm text-gray">Loading role details...</p>}>
      <EditRoleForm />
    </Suspense>
  );
}
