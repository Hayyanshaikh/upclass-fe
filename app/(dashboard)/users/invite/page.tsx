import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import UserForm from "@/components/forms/UserForm";

export const metadata: Metadata = { title: "Invite user | UPCLASS" };

export default function InviteUserRoute() {
  return (
    <div>
      <PageHeader
        title="Invite user"
        breadcrumbs={[{ title: "Users", href: "/users" }, { title: "Invite user" }]}
      />
      <UserForm />
    </div>
  );
}
