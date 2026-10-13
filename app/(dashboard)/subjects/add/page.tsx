import type { Metadata } from "next";
import SubjectFormPage from "@/components/subjects/SubjectFormPage";

export const metadata: Metadata = { title: "Add subject | UPCLASS" };

export default function AddSubjectPage() {
  return <SubjectFormPage />;
}
