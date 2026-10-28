"use client";

import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useTeachersControllerFindOne } from "@/app/api/endpoints";
import TeacherForm from "@/components/forms/TeacherForm";
import PageHeader from "@/components/shared/PageHeader";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import type { TeacherRouteParams } from "@/types/teacher";

export default function EditTeacherForm() {
  const { id } = useParams<TeacherRouteParams>();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useTeachersControllerFindOne(id, {
    query: { refetchOnMount: "always" },
  });

  if (isLoading) return <Loader />;

  if (error || !response?.data) {
    const message =
      isAxiosError(error) && error.response?.status === 404
        ? "Teacher not found."
        : "Unable to load teacher.";

    return (
      <div>
        <PageHeader
          title="Edit teacher"
          breadcrumbs={[
            { title: "Teachers", href: "/teachers" },
            { title: "Edit teacher" },
          ]}
        />
        <Alert type="error" role="alert" message={message} />
        {message !== "Teacher not found." && (
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <TeacherForm key={id} teacher={response.data} onSaved={refetch} />;
}
