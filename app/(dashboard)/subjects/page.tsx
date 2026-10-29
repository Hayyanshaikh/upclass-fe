import type { Metadata } from "next";
import Subjects from "@/components/subjects/Subjects";

export const metadata: Metadata = { title: "Subjects | UPCLASS" };

export default function SubjectsPage() {
  return <Subjects />;
}
