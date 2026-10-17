import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditUserForm from "@/components/forms/EditUserForm";

export const metadata: Metadata = { title: "Edit user | UPCLASS" };

export default function EditUserRoute() {
  return (
    <div>
      <PageHeader
        title="Edit user"
        breadcrumbs={[{ title: "Users", href: "/users" }, { title: "Edit user" }]}
      />
      <Suspense fallback={<p role="status" className="text-sm text-gray">Loading user details...</p>}>
        <EditUserForm />
      </Suspense>
    </div>
  );
}
