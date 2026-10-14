"use client";

import { notFound, useParams } from "next/navigation";
import FeeStructureForm from "@/components/forms/FeeStructureForm";
import { useFeeStructureStore } from "@/stores/fee-structures";

export default function EditFeeStructureForm() {
  const { id } = useParams<{ id: string }>();
  const structure = useFeeStructureStore((state) => state.records.find((record) => record.id === id));
  if (!structure) notFound();

  return <FeeStructureForm key={structure.id} structure={structure} />;
}
