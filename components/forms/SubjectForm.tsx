"use client";

import { useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useSubjectsControllerCreate } from "@/app/api/endpoints";
import type { CreateSubjectDto } from "@/app/api/schemas";
import ErrorDialog from "@/components/shared/ErrorDialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import {
  practicalComponentOptions,
  subjectFormDefaults,
  subjectStatusOptions,
  subjectTypeOptions,
} from "@/constants/subjects";
import type { Subject, SubjectFormValues } from "@/types/subject";

type SubjectFormProps = {
  subject?: Subject;
  onCancel: () => void;
  onCreated: (values: SubjectFormValues, id: string) => void;
  onEditSave: (values: SubjectFormValues) => void;
};

export default function SubjectForm({
  subject,
  onCancel,
  onCreated,
  onEditSave,
}: SubjectFormProps) {
  const [form] = Form.useForm<SubjectFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: createSubject, isPending } =
    useSubjectsControllerCreate();

  const initialValues: Partial<SubjectFormValues> = subject
    ? {
        name: subject.name,
        code: subject.code,
        type: subject.type,
        status: subject.status,
        hasPractical: subject.hasPractical ?? "No",
        totalMarks: subject.totalMarks ?? 100,
        passingMarks: subject.passingMarks ?? 40,
      }
    : subjectFormDefaults;

  async function handleSubmit(values: SubjectFormValues) {
    if (isSaving || isPending) return;

    setSubmitError(null);

    if (subject) {
      // Edit path: no update endpoint yet, persist to the store.
      onEditSave(values);
      return;
    }

    const data: CreateSubjectDto = {
      name: values.name.trim(),
      code: values.code.trim(),
      type: values.type as CreateSubjectDto["type"],
      status: values.status as CreateSubjectDto["status"],
      hasPractical: values.hasPractical === "Yes",
      defaultTotalMarks: Number(values.totalMarks),
      defaultPassingMarks: Number(values.passingMarks),
    };

    setIsSaving(true);
    try {
      const response = await createSubject({ data });
      onCreated(values, response.data.id);
    } catch (error) {
      const body = isAxiosError(error)
        ? (error.response?.data as
            | { message?: string; data?: { errors?: string[] } }
            | undefined)
        : undefined;

      const message =
        body?.data?.errors?.[0] ??
        body?.message ??
        (error instanceof Error ? error.message : undefined);

      setSubmitError(message ?? "Unable to add subject. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form
      key={subject?.id ?? "new-subject"}
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => void handleSubmit(values)}
      onValuesChange={() => setSubmitError(null)}
      scrollToFirstError
      requiredMark={false}
      className="flex flex-col gap-5"
    >
      <ErrorDialog
        open={submitError !== null}
        message={submitError ?? ""}
        onClose={() => setSubmitError(null)}
      />

      <SectionCard title="Subject details" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            name="name"
            label="Subject name"
            isRequird
            rules={[
              { whitespace: true, message: "Enter a subject name." },
            ]}
          />
          <Input
            name="code"
            label="Subject code"
            isRequird
            placeholder="e.g. MATH"
            rules={[
              {
                pattern: /^[A-Za-z0-9-]+$/,
                message: "Use letters, numbers and hyphens.",
              },
            ]}
          />
          <Select
            name="type"
            label="Type"
            options={subjectTypeOptions}
            isRequird
            placeholder="Select"
            showSearch={false}
          />
          <Select
            name="status"
            label="Status"
            options={subjectStatusOptions}
            isRequird
            placeholder="Select"
            showSearch={false}
          />
        </div>
      </SectionCard>

      <SectionCard title="Grading" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            name="hasPractical"
            label="Has practical / lab component"
            options={practicalComponentOptions}
            placeholder="Select"
            showSearch={false}
          />
          <Input
            name="totalMarks"
            label="Default total marks"
            type="number"
            isRequird
            rules={[
              { min: 0, message: "Enter 0 or more." },
            ]}
          />
          <Input
            name="passingMarks"
            label="Default passing marks"
            type="number"
            isRequird
            rules={[
              { min: 0, message: "Enter 0 or more." },
            ]}
          />
        </div>
      </SectionCard>

      <div className="flex flex-wrap justify-end gap-3 pb-4">
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" loading={isSaving} disabled={isSaving}>
          {subject ? "Save changes" : "Save subject"}
        </Button>
      </div>
    </Form>
  );
}
