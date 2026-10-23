import type { Metadata } from "next";
import UserForm from "@/components/forms/UserForm";

export const metadata: Metadata = { title: "Add user | UPCLASS" };

export default function AddUserRoute() {
  return <UserForm />;
}
