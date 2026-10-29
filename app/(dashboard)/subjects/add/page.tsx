import type { Metadata } from "next";
import SubjectForm from "@/components/forms/SubjectForm";

export const metadata: Metadata = { title: "Add subject | UPCLASS" };

export default function AddSubjectRoute() {
  return <SubjectForm />;
}
