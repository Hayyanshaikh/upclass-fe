"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import SubjectForm from "@/components/forms/SubjectForm";
import { useSubjectStore } from "@/stores/subjects";
import type { Subject, SubjectFormValues } from "@/types/subject";

type SubjectFormPageProps = {
  subjectId?: string;
};

export default function SubjectFormPage({ subjectId }: SubjectFormPageProps) {
  const router = useRouter();
  const subject = useSubjectStore((state) =>
    subjectId
      ? state.records.find((record) => record.id === subjectId)
      : undefined,
  );
  const saveSubject = useSubjectStore((state) => state.saveSubject);

  // Store-only persistence. The API create call happens in the form;
  // this is used by the edit path and to refresh the list preview.
  function handleSave(values: SubjectFormValues, id?: string) {
    const record: Subject = {
      id: id ?? subject?.id ?? `SUB-${Date.now()}`,
      name: values.name,
      code: values.code,
      type: values.type,
      status: values.status,
      hasPractical: values.hasPractical,
      totalMarks: Number(values.totalMarks),
      passingMarks: Number(values.passingMarks),
      classes: subject?.classes ?? 0,
      teachers: subject?.teachers ?? 0,
    };
    saveSubject(record);
    router.push("/subjects");
  }

  const title = subjectId ? "Edit subject" : "Add subject";

  return (
    <div>
      <PageHeader
        title={title}
        breadcrumbs={[
          { title: "Subjects", href: "/subjects" },
          { title: subjectId ? "Edit subject" : "Add" },
        ]}
      />
      {subjectId && !subject ? (
        <SectionCard className="h-auto!">
          <p className="text-sm text-gray">
            This subject could not be found in the current preview.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => router.push("/subjects")}
          >
            Back to subjects
          </Button>
        </SectionCard>
      ) : (
        <SubjectForm
          subject={subject}
          onCancel={() => router.push("/subjects")}
          onCreated={(values, id) => handleSave(values, id)}
          onEditSave={(values) => handleSave(values, subject?.id)}
        />
      )}
    </div>
  );
}
