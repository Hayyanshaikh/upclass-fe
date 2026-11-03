"use client";

import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useClassesControllerFindOne } from "@/app/api/endpoints";
import ClassForm from "@/components/forms/ClassForm";
import PageHeader from "@/components/shared/PageHeader";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { ROUTE_NAMES } from "@/constants/routes";
import type { ClassRouteParams } from "@/types/classes";

export default function EditClassForm() {
  const { id } = useParams<ClassRouteParams>();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useClassesControllerFindOne(id, {
    query: { refetchOnMount: "always" },
  });

  if (isLoading) return <Loader />;

  if (error || !response?.data) {
    const message =
      isAxiosError(error) && error.response?.status === 404
        ? "Class not found."
        : "Unable to load class.";

    return (
      <div>
        <PageHeader
          title="Edit class"
          breadcrumbs={[
            { title: "Classes", href: ROUTE_NAMES.classListing },
            { title: "Edit class" },
          ]}
        />
        <Alert type="error" role="alert" message={message} />
        {message !== "Class not found." && (
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <ClassForm key={id} schoolClass={response.data} onSaved={refetch} />;
}
