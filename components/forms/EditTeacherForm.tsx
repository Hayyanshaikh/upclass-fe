"use client";

import { notFound, useParams } from "next/navigation";
import TeacherForm from "@/components/forms/TeacherForm";
import { useTeacherStore } from "@/stores/teachers";
import type { TeacherRouteParams } from "@/types/teacher";

export default function EditTeacherForm() {
  const { id } = useParams<TeacherRouteParams>();
  const teacher = useTeacherStore((state) => state.records.find((record) => record.id === id));
  if (!teacher) notFound();

  return <TeacherForm key={id} teacher={teacher} />;
}
