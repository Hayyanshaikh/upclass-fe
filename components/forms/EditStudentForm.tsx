"use client";

import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useStudentsControllerFindOne } from "@/app/api/endpoints";
import StudentForm from "@/components/forms/StudentForm";
import PageHeader from "@/components/shared/PageHeader";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import type { StudentRouteParams } from "@/types/student";

export default function EditStudentForm() {
  const { id } = useParams<StudentRouteParams>();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useStudentsControllerFindOne(id, {
    query: { refetchOnMount: "always" },
  });

  if (isLoading) return <Loader />;

  if (error || !response?.data) {
    const message =
      isAxiosError(error) && error.response?.status === 404
        ? "Student not found."
        : "Unable to load student.";

    return (
      <div>
        <PageHeader
          title="Edit student"
          breadcrumbs={[
            { title: "Students", href: "/students" },
            { title: "Edit student" },
          ]}
        />
        <Alert type="error" role="alert" message={message} />
        {message !== "Student not found." && (
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <StudentForm key={id} student={response.data} />;
}
