import type { Metadata } from "next";
import ClassesPage from "@/components/classes/ClassesPage";

export const metadata: Metadata = { title: "Classes | UPCLASS" };

export default function ClassesRoute() {
  return <ClassesPage />;
}
