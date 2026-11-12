"use client";

import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useSectionsControllerFindOne } from "@/app/api/endpoints";
import Loader from "@/components/ui/Loader";
import PageHeader from "@/components/shared/PageHeader";
import SectionForm from "@/components/forms/SectionForm";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

export default function EditSectionForm() {
  const { id } = useParams<{ id: string }>();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useSectionsControllerFindOne(id, {
    query: { refetchOnMount: "always" },
  });

  if (isLoading) return <Loader />;

  if (error || !response?.data) {
    const message =
      isAxiosError(error) && error.response?.status === 404
        ? "Section not found."
        : "Unable to load section.";

    return (
      <div>
        <PageHeader
          title="Edit section"
          breadcrumbs={[
            { title: "Sections", href: "/sections" },
            { title: "Edit section" },
          ]}
        />
        <Alert type="error" role="alert" message={message} />
        {message !== "Section not found." && (
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <SectionForm key={id} section={response.data} onSaved={refetch} />
  );
}
