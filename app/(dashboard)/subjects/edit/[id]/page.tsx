import type { Metadata } from "next";
import SubjectFormPage from "@/components/subjects/SubjectFormPage";

export const metadata: Metadata = { title: "Edit subject | UPCLASS" };

export default async function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubjectFormPage subjectId={id} />;
}
