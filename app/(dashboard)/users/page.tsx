import type { Metadata } from "next";
import UsersPage from "@/components/users/UsersPage";

export const metadata: Metadata = { title: "Users | UPCLASS" };

export default function UsersRoute() {
  return <UsersPage />;
}
