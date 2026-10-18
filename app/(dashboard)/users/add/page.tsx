import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import UserForm from "@/components/forms/UserForm";

export const metadata: Metadata = { title: "Add user | UPCLASS" };

export default function AddUserRoute() {
  return (
    <div>
      <PageHeader
        title="Add user"
        breadcrumbs={[{ title: "Users", href: "/users" }, { title: "Add user" }]}
      />
      <UserForm />
    </div>
  );
}
