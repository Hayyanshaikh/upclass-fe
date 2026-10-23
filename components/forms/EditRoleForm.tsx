"use client";

import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useRolesControllerFindOne } from "@/app/api/endpoints";
import PageHeader from "@/components/shared/PageHeader";
import RoleForm from "@/components/forms/RoleForm";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

export default function EditRoleForm() {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, error, refetch } =
    useRolesControllerFindOne(id);

  if (isLoading) return <Loader />;

  if (error || !response?.data) {
    const message =
      isAxiosError(error) && error.response?.status === 404
        ? "Role not found."
        : "Unable to load role.";

    return (
      <div>
        <PageHeader
          title="Edit role"
          breadcrumbs={[{ title: "Roles", href: "/roles" }, { title: "Edit role" }]}
        />
        <Alert type="error" role="alert" message={message} />
        {message !== "Role not found." && (
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <RoleForm key={id} role={response.data} />;
}
