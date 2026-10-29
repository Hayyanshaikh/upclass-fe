"use client";

import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useSubjectsControllerFindOne } from "@/app/api/endpoints";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/shared/PageHeader";
import SubjectForm from "@/components/forms/SubjectForm";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

export default function EditSubjectForm() {
  const { id } = useParams<{ id: string }>();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useSubjectsControllerFindOne(id, {
    query: { refetchOnMount: "always" },
  });

  if (isLoading) return <Loader />;

  if (error || !response?.data) {
    const message =
      isAxiosError(error) && error.response?.status === 404
        ? "Subject not found."
        : "Unable to load subject.";

    return (
      <div>
        <PageHeader
          title="Edit subject"
          breadcrumbs={[
            { title: "Subjects", href: "/subjects" },
            { title: "Edit subject" },
          ]}
        />
        <Alert type="error" role="alert" message={message} />
        {message !== "Subject not found." && (
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <SubjectForm
      key={id}
      subject={response.data}
      onSaved={refetch}
    />
  );
}
