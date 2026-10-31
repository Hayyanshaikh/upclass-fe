import type { Metadata } from "next";
import SchoolsPage from "@/components/schools/SchoolsPage";

export const metadata: Metadata = { title: "Schools | UPCLASS" };

export default function SchoolsRoute() {
  return <SchoolsPage />;
}