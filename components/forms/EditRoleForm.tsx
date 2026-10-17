"use client";

import { notFound, useParams } from "next/navigation";
import RoleForm from "@/components/forms/RoleForm";
import { useRoleStore } from "@/stores/roles";

export default function EditRoleForm() {
  const { id } = useParams<{ id: string }>();
  const role = useRoleStore((state) =>
    state.records.find((record) => record.id === id),
  );
  if (!role) notFound();

  return <RoleForm key={id} role={role} />;
}
