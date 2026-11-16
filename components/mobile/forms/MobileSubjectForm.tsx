"use client";

import { useEffect, useState } from "react";
import { Drawer, Form } from "antd";
import { isAxiosError } from "axios";
import { LuTrash2, LuX } from "react-icons/lu";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
  practicalComponentOptions,
  subjectFormDefaults,
  subjectStatusOptions,
  subjectTypeOptions,
} from "@/constants/subjects";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";
import type {
  CreateSubjectDto,
  SubjectDto,
  UpdateSubjectDto,
} from "@/app/api/schemas";
import type { SubjectFormValues } from "@/types/subject";
import {
  useSubjectsControllerCreate,
  useSubjectsControllerUpdate,
} from "@/app/api/endpoints";

type MobileSubjectFormProps = {
  open: boolean;
  subject?: SubjectDto;
  onClose: () => void;
  onSaved: (message: string) => void;
  onDelete?: () => void;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const body = error.response?.data as
    | { message?: string; data?: { errors?: string[] } }
    | undefined;

  return body?.data?.errors?.[0] ?? body?.message ?? fallback;
}

export default function MobileSubjectForm({
  open,
  subject,
  onClose,
  onSaved,
  onDelete,
}: MobileSubjectFormProps) {
  const [form] = Form.useForm<SubjectFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: createSubject, isPending: isCreating } =
    useSubjectsControllerCreate();
  const { mutateAsync: updateSubject, isPending: isUpdating } =
    useSubjectsControllerUpdate();
  const isPending = isCreating || isUpdating;

  const { triggerRef, triggerProps } = useSwipeToDismiss({
    onDismiss: onClose,
  });

  useEffect(() => {
    if (!open) return;

    setSubmitError(null);

    if (subject) {
      form.setFieldsValue({
        name: subject.name,
        code: subject.code,
        type: subject.type,
        status: subject.status,
        hasPractical: subject.hasPractical ? "Yes" : "No",
        totalMarks: subject.defaultTotalMarks,
        passingMarks: subject.defaultPassingMarks,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      ...subjectFormDefaults,
      hasPractical:
        subjectFormDefaults.hasPractical as SubjectFormValues["hasPractical"],
    });
  }, [open, subject, form]);

  async function handleSubmit(values: SubjectFormValues) {
    if (isPending) return;

    setSubmitError(null);

    const baseData = {
      name: values.name.trim(),
      code: values.code.trim(),
      type: values.type as CreateSubjectDto["type"],
      status: values.status as CreateSubjectDto["status"],
      hasPractical: values.hasPractical === "Yes",
      defaultTotalMarks: Number(values.totalMarks),
      defaultPassingMarks: Number(values.passingMarks),
    };

    try {
      if (subject) {
        const data: UpdateSubjectDto = baseData;
        await updateSubject({ id: subject.id, data });
        onSaved("Subject updated successfully.");
      } else {
        const data: CreateSubjectDto = baseData;
        await createSubject({ data });
        onSaved("Subject added successfully.");
      }
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          `Unable to ${subject ? "update" : "add"} subject.`,
        ),
      );
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      size="auto"
      closable={false}
      mask={{ closable: true }}
      classNames={{
        section: "rounded-t-2xl!  shadow-xl! bg-background!",
        body: "flex! max-h-[85dvh]! flex-col! overflow-hidden! px-4! pt-0! pb-[calc(1rem+env(safe-area-inset-bottom))]!",
        wrapper: "shadow-none!",
      }}
    >
      <div
        ref={triggerRef}
        aria-hidden="true"
        className="mx-auto flex w-full touch-none justify-center py-3 select-none"
        {...triggerProps}
      >
        <span className="h-1 w-10 rounded-full bg-border" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-dark">
          {subject ? "Edit subject" : "Add subject"}
        </h2>
        <IconButton variant="ghost" label="Close" onClick={onClose}>
          <LuX size={20} aria-hidden="true" />
        </IconButton>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={subjectFormDefaults}
        onFinish={(values) => void handleSubmit(values)}
        onValuesChange={() => setSubmitError(null)}
        scrollToFirstError
        requiredMark={false}
        className="mt-4 flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
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
            rules={[{ pattern: /^\d+$/, message: "Enter a whole number." }]}
          />
          <Input
            name="passingMarks"
            label="Default passing marks"
            type="number"
            placeholder="Enter passing marks"
            isRequird
            rules={[{ pattern: /^\d+$/, message: "Enter a whole number." }]}
          />

          {submitError && (
            <p
              role="alert"
              className="rounded-md bg-danger/10 px-3 py-2 text-sm font-semibold text-danger"
            >
              {submitError}
            </p>
          )}
        </div>

        <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
          {subject && onDelete && (
            <IconButton
              label="Delete subject"
              variant="danger"
              onClick={onDelete}
            >
              <LuTrash2 size={18} aria-hidden="true" />
            </IconButton>
          )}
          <Button
            fullWidth
            variant="secondary"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button fullWidth type="submit" loading={isPending}>
            Save
          </Button>
        </div>
      </Form>
    </Drawer>
  );
}
