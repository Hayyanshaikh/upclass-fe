"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { LuX } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Loader from "@/components/ui/Loader";
import SchoolForm from "@/components/forms/SchoolForm";
import { useSchoolsControllerFindOne } from "@/app/api/endpoints";

export default function EditSchoolForm() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useSchoolsControllerFindOne(id, {
    query: { refetchOnMount: "always" },
  });

  if (isLoading) return <Loader />;

  if (error || !response?.data) {
    const message =
      isAxiosError(error) && error.response?.status === 404
        ? "School not found."
        : "Unable to load school.";

    return (
      <div>
        <PageHeader
          title="Edit school"
          compactMobile
          breadcrumbs={[
            { title: "Schools", href: "/schools" },
            { title: "Edit school" },
          ]}
          actions={
            <Button
              variant="secondary"
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              onClick={() => void router.push("/schools")}
            >
              <LuX size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Cancel</span>
            </Button>
          }
        />
        <Alert type="error" role="alert" message={message} />
        {message !== "School not found." && (
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <SchoolForm key={id} school={response.data} />;
}
