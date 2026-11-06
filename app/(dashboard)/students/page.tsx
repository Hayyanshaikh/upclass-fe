import type { Metadata } from "next";
import StudentsPage from "@/components/students/StudentsPage";

export const metadata: Metadata = { title: "Students | UPCLASS" };

export default function StudentsRoute() {
  return <StudentsPage />;
}
