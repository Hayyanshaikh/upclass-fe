"use client";

import { useParams } from "next/navigation";
import UserForm from "@/components/forms/UserForm";
import { useUserControllerFindOne } from "@/app/api/endpoints";
import type { UserFindOneResponseDto } from "@/app/api/schemas";
import Loader from "@/components/ui/Loader";
import { isAxiosError } from "axios";
import type { UserAccount } from "@/types/user-management";

export default function EditUserForm() {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading, error } = useUserControllerFindOne<
    UserFindOneResponseDto,
    unknown
  >(id);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <p>
        {isAxiosError(error) && error.response?.status === 404
          ? "User not found."
          : "Unable to load user."}
      </p>
    );
  }

  if (!response?.data) return <p>User not found.</p>;

  const user: UserAccount = {
    id: response.data.id,
    email: response.data.email,
    isActive: response.data.isActive ? "Active" : "Inactive",
    name: response.data.name,
    role: response.data.roleId ?? response.data.role?.id ?? "",
  };

  return <UserForm key={id} user={user} />;
}
