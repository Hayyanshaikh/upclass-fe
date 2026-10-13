import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import ExamForm from "@/components/forms/ExamForm";
import { exams } from "@/constants/exams";
import type { EditExamPageProps } from "@/types/exam";

export const metadata: Metadata = { title: "Edit exam | UPCLASS" };

export default async function EditExamPage({ params }: EditExamPageProps) {
  const { id } = await params;
  const exam = exams.find((record) => record.id === id);
  if (!exam) notFound();

  return (
    <div>
      <PageHeader title="Edit exam" subtitle={exam.name}
        breadcrumbs={[{ title: "Exams", href: "/exams" }, { title: "Edit" }]} />
      <ExamForm exam={exam} />
    </div>
  );
}
