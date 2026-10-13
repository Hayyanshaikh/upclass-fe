import type { Metadata } from "next";
import Exams from "@/components/exams/Exams";

export const metadata: Metadata = { title: "Exams & Results | UPCLASS" };

export default function ExamsPage() {
  return <Exams />;
}
