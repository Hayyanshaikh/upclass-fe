"use client";

import { useParams } from "next/navigation";
import UserForm from "@/components/forms/UserForm";
import { useUserControllerFindOne } from "@/app/api/endpoints";
import PageHeader from "@/components/shared/PageHeader";
import { ROUTE_NAMES } from "@/constants/routes";
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

  const editHeader = (
    <PageHeader
      title="Edit user"
      breadcrumbs={[
        { title: "Users", href: ROUTE_NAMES.userListing },
        { title: "Edit user" },
      ]}
    />
  );

  if (isLoading) {
    return (
      <>
        {editHeader}
        <Loader />
      </>
    );
  }

  if (error) {
    return (
      <>
        {editHeader}
        <p>
          {isAxiosError(error) && error.response?.status === 404
            ? "User not found."
            : "Unable to load user."}
        </p>
      </>
    );
  }

  if (!response?.data) {
    return (
      <>
        {editHeader}
        <p>User not found.</p>
      </>
    );
  }

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
