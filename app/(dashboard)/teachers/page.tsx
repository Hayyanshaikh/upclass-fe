import type { Metadata } from "next";
import TeachersPage from "@/components/teachers/TeachersPage";

export const metadata: Metadata = { title: "Teachers | UPCLASS" };

export default function TeachersRoute() {
  return <TeachersPage />;
}
