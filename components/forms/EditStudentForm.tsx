"use client";

import { notFound, useParams } from "next/navigation";
import StudentForm from "@/components/forms/StudentForm";
import { students } from "@/constants/students";
import type { StudentRouteParams } from "@/types/student";

export default function EditStudentForm() {
  const { id } = useParams<StudentRouteParams>();
  const student = students.find((item) => item.id === id);
  if (!student) notFound();

  return <StudentForm key={id} student={student} />;
}
