"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { LuTrash2 } from "react-icons/lu";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { sectionFormDefaults, sectionStatusOptions } from "@/constants/sections";
import {
  useSectionsControllerCreate,
  useSectionsControllerUpdate,
} from "@/app/api/endpoints";
import type {
  CreateSectionDto,
  SectionDto,
  UpdateSectionDto,
} from "@/app/api/schemas";
import type { SectionFormValues } from "@/types/section";

type MobileSectionFormProps = {
  open: boolean;
  section?: SectionDto;
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

export default function MobileSectionForm({
  open,
  section,
  onClose,
  onSaved,
  onDelete,
}: MobileSectionFormProps) {
  const [form] = Form.useForm<SectionFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: createSection, isPending: isCreating } =
    useSectionsControllerCreate();
  const { mutateAsync: updateSection, isPending: isUpdating } =
    useSectionsControllerUpdate();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;

    setSubmitError(null);

    if (section) {
      form.setFieldsValue({
        name: section.name,
        status: section.status,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue(sectionFormDefaults);
  }, [open, section, form]);

  async function handleSubmit(values: SectionFormValues) {
    if (isPending) return;

    setSubmitError(null);

    const baseData = {
      name: values.name.trim(),
      status: values.status as CreateSectionDto["status"],
    };

    try {
      if (section) {
        const data: UpdateSectionDto = baseData;
        await updateSection({ id: section.id, data });
        onSaved("Section updated successfully.");
        return;
      }

      const data: CreateSectionDto = baseData;
      await createSection({ data });
      onSaved("Section added successfully.");
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          `Unable to ${section ? "update" : "add"} section.`,
        ),
      );
    }
  }

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title={section ? "Edit section" : "Add section"}
      closeLabel="Close"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={sectionFormDefaults}
        onFinish={(values) => void handleSubmit(values)}
        onValuesChange={() => setSubmitError(null)}
        scrollToFirstError
        requiredMark={false}
        className="mt-4 flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
          <Input
            name="name"
            label="Section name"
            placeholder="Enter section name"
            isRequird
            rules={[{ whitespace: true, message: "Enter a section name." }]}
          />
          <Select
            name="status"
            label="Status"
            options={sectionStatusOptions}
            placeholder="Select"
            showSearch={false}
            isRequird
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
          {section && onDelete && (
            <IconButton
              label="Delete section"
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
    </MobileSheet>
  );
}
