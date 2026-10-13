import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import ExamForm from "@/components/forms/ExamForm";

export const metadata: Metadata = { title: "Create exam | UPCLASS" };

export default function CreateExamPage() {
  return (
    <div>
      <PageHeader title="Create exam" breadcrumbs={[{ title: "Exams", href: "/exams" }, { title: "Create" }]} />
      <ExamForm />
    </div>
  );
}
