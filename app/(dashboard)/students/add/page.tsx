import type { Metadata } from "next";
import StudentForm from "@/components/forms/StudentForm";

export const metadata: Metadata = { title: "Add student | UPCLASS" };

export default function AddStudentPage() {
  return <StudentForm />;
}
