"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { LuSave, LuX } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
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
import type { SubjectFormProps, SubjectFormValues } from "@/types/subject";
import {
  useSubjectsControllerCreate,
  useSubjectsControllerFindAll,
  useSubjectsControllerUpdate,
} from "@/app/api/endpoints";
import type { CreateSubjectDto, UpdateSubjectDto } from "@/app/api/schemas";

export default function SubjectForm({ subject, onSaved }: SubjectFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<SubjectFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: createSubject, isPending: isCreating } =
    useSubjectsControllerCreate();
  const { mutateAsync: updateSubject, isPending: isUpdating } =
    useSubjectsControllerUpdate();
  const { refetch } = useSubjectsControllerFindAll();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!subject) return;
    form.setFieldsValue({
      name: subject.name,
      code: subject.code,
      type: subject.type,
      status: subject.status,
      hasPractical: subject.hasPractical ? "Yes" : "No",
      totalMarks: subject.defaultTotalMarks,
      passingMarks: subject.defaultPassingMarks,
    });
  }, [form, subject]);

  useEffect(() => {
    if (subject) return;
    return () => form.resetFields();
  }, [form, subject]);

  async function handleSubmit(values: SubjectFormValues) {
    if (isSaving || isPending) return;

    setSubmitError(null);
    setSubmitSuccess(null);

    const baseData = {
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
      if (subject) {
        const data: UpdateSubjectDto = baseData;
        await updateSubject({ id: subject.id, data });
        await onSaved?.();
        setSubmitSuccess("Subject updated successfully.");
      } else {
        const data: CreateSubjectDto = baseData;
        const response = await createSubject({ data });
        setSuccessRedirect(
          `/subjects/edit/${encodeURIComponent(response.data.id)}`,
        );
        setSubmitSuccess("Subject added successfully.");
      }
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

      setSubmitError(
        message ?? `Unable to ${subject ? "update" : "add"} subject.`,
      );
    } finally {
      setIsSaving(false);
    }
  }

  function closeSuccessDialog() {
    setSubmitSuccess(null);
    if (successRedirect) {
      router.push(successRedirect);
      setSuccessRedirect(null);
    }
  }

  return (
    <div>
      <PageHeader
        title={subject?.name ?? "Add subject"}
        compactMobile
        breadcrumbs={[
          { title: "Subjects", href: "/subjects" },
          { title: subject ? "Edit subject" : "Add subject" },
        ]}
        actions={
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              disabled={isPending}
              onClick={() => {
                if (!subject) form.resetFields();
                router.push("/subjects");
              }}
            >
              <LuX size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Cancel</span>
            </Button>
            <Button
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              loading={isSaving}
              onClick={() => form.submit()}
            >
              <LuSave size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">
                {subject ? "Update subject" : "Add subject"}
              </span>
            </Button>
          </div>
        }
      />

      <ErrorDialog
        open={submitError !== null}
        message={submitError ?? ""}
        onClose={() => setSubmitError(null)}
      />
      <SuccessDialog
        open={submitSuccess !== null}
        message={submitSuccess ?? ""}
        onClose={closeSuccessDialog}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={
          subject
            ? {
                name: subject.name,
                code: subject.code,
                type: subject.type,
                status: subject.status,
                hasPractical: subject.hasPractical ? "Yes" : "No",
                totalMarks: subject.defaultTotalMarks,
                passingMarks: subject.defaultPassingMarks,
              }
            : subjectFormDefaults
        }
        onFinish={(values) => void handleSubmit(values)}
        onValuesChange={() => {
          setSubmitError(null);
          setSubmitSuccess(null);
        }}
        scrollToFirstError
        requiredMark={false}
        className="flex flex-col gap-5"
      >
        <SectionCard title="Subject details" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              name="name"
              label="Subject name"
              placeholder="Enter subject name"
              isRequird
              rules={[{ whitespace: true, message: "Enter a subject name." }]}
            />
            <Input
              name="code"
              label="Subject code"
              placeholder="e.g. MATH"
              isRequird
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

        <SectionCard title="Grading" autoHeight>
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
              placeholder="Enter total marks"
              isRequird
              rules={[
                {
                  pattern: /^\d+$/,
                  message: "Enter a whole number.",
                },
              ]}
            />
            <Input
              name="passingMarks"
              label="Default passing marks"
              type="number"
              placeholder="Enter passing marks"
              isRequird
              rules={[
                {
                  pattern: /^\d+$/,
                  message: "Enter a whole number.",
                },
              ]}
            />
          </div>
        </SectionCard>
      </Form>
    </div>
  );
}
