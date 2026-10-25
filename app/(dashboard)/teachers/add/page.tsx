import type { Metadata } from "next";
import TeacherForm from "@/components/forms/TeacherForm";

export const metadata: Metadata = { title: "Add teacher | UPCLASS" };

export default function AddTeacherRoute() {
  return <TeacherForm />;
}
