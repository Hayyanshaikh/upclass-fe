import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import TeacherForm from "@/components/forms/TeacherForm";

export const metadata: Metadata = { title: "Add teacher | UPCLASS" };

export default function AddTeacherPage() {
  return (
    <div>
      <PageHeader title="Add teacher" breadcrumbs={[{ title: "Teachers", href: "/teachers" }, { title: "Add teacher" }]} />
      <TeacherForm />
    </div>
  );
}
