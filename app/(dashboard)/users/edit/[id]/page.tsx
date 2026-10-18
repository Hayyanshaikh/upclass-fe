import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditUserForm from "@/components/forms/EditUserForm";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = { title: "Edit user | UPCLASS" };

export default function EditUserRoute() {
  return (
    <div>
      <PageHeader
        title="Edit user"
        breadcrumbs={[
          { title: "Users", href: "/users" },
          { title: "Edit user" },
        ]}
      />
      <Suspense fallback={<Loader />}>
        <EditUserForm />
      </Suspense>
    </div>
  );
}
