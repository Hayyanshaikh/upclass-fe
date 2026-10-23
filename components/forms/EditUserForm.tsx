"use client";

import { useParams } from "next/navigation";
import UserForm from "@/components/forms/UserForm";
import { useUserControllerFindOne } from "@/app/api/endpoints";
import type { UserFindOneResponseDto } from "@/app/api/schemas";
import Loader from "@/components/ui/Loader";
import { isAxiosError } from "axios";
import type { UserAccount, UserApiItem } from "@/types/user-management";

export default function EditUserForm() {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading, error, refetch } = useUserControllerFindOne<
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

  const userData: UserApiItem = response.data;
  const user: UserAccount = {
    id: userData.id,
    email: userData.email,
    isActive: userData.isActive ? "Active" : "Inactive",
    isSystem: userData.isSystem ?? false,
    name: userData.name,
    role: userData.roleId ?? userData.role?.id ?? "",
  };

  return <UserForm key={id} user={user} onSaved={refetch} />;
}
