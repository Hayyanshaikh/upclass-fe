import type { Metadata } from "next";
import RoleForm from "@/components/forms/RoleForm";

export const metadata: Metadata = { title: "Add role | UPCLASS" };

export default function AddRoleRoute() {
  return <RoleForm />;
}
