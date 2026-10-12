"use client";

import { notFound, useParams } from "next/navigation";
import ClassForm from "@/components/forms/ClassForm";
import { useClassStore } from "@/stores/classes";
import type { ClassRouteParams } from "@/types/classes";

export default function EditClassForm() {
  const { id } = useParams<ClassRouteParams>();
  const schoolClass = useClassStore((state) => state.records.find((record) => record.id === id));
  if (!schoolClass) notFound();

  return <ClassForm key={id} schoolClass={schoolClass} />;
}
