import type { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import StudentForm from "@/components/forms/StudentForm";

export const metadata: Metadata = {
  title: "Add student | UPCLASS",
};

export default function AddStudentPage() {
  return (
    <div>
      <PageHeader
        title="Add student"
        breadcrumbs={[{ title: "Students", href: "/students" }, { title: "Add student" }]}
      />
      <StudentForm />
    </div>
  );
}
