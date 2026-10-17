import type { Metadata } from "next";
import RolesPage from "@/components/roles/RolesPage";

export const metadata: Metadata = { title: "Roles | UPCLASS" };

export default function RolesRoute() {
  return <RolesPage />;
}
