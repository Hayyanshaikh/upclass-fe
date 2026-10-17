"use client";

import { notFound, useParams } from "next/navigation";
import UserForm from "@/components/forms/UserForm";
import { useUserStore } from "@/stores/users";

export default function EditUserForm() {
  const { id } = useParams<{ id: string }>();
  const user = useUserStore((state) =>
    state.records.find((record) => record.id === id),
  );
  if (!user) notFound();

  return <UserForm key={id} user={user} />;
}
