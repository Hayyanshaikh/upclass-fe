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
  sectionFormDefaults,
  sectionStatusOptions,
} from "@/constants/sections";
import type { SectionFormProps, SectionFormValues } from "@/types/section";
import {
  useSectionsControllerCreate,
  useSectionsControllerFindAll,
  useSectionsControllerUpdate,
} from "@/app/api/endpoints";
import type { CreateSectionDto, UpdateSectionDto } from "@/app/api/schemas";

export default function SectionForm({ section, onSaved }: SectionFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<SectionFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: createSection, isPending: isCreating } =
    useSectionsControllerCreate();
  const { mutateAsync: updateSection, isPending: isUpdating } =
    useSectionsControllerUpdate();
  const { refetch } = useSectionsControllerFindAll();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!section) return;
    form.setFieldsValue({
      name: section.name,
      status: section.status,
    });
  }, [form, section]);

  useEffect(() => {
    if (section) return;
    return () => form.resetFields();
  }, [form, section]);

  async function handleSubmit(values: SectionFormValues) {
    if (isSaving || isPending) return;

    setSubmitError(null);
    setSubmitSuccess(null);

    const baseData = {
      name: values.name.trim(),
      status: values.status as CreateSectionDto["status"],
    };

    setIsSaving(true);
    try {
      if (section) {
        const data: UpdateSectionDto = baseData;
        await updateSection({ id: section.id, data });
        await onSaved?.();
        setSubmitSuccess("Section updated successfully.");
      } else {
        const data: CreateSectionDto = baseData;
        const response = await createSection({ data });
        setSuccessRedirect(
          `/sections/edit/${encodeURIComponent(response.data.id)}`,
        );
        setSubmitSuccess("Section added successfully.");
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
        message ?? `Unable to ${section ? "update" : "add"} section.`,
      );
    } finally {
      setIsSaving(false);
    }
  }

  function closeSuccessDialog() {
    if (!section) form.resetFields();
    setSubmitSuccess(null);
    if (successRedirect) {
      router.push(successRedirect);
      setSuccessRedirect(null);
    }
  }

  return (
    <div>
      <PageHeader
        title={section?.name ?? "Add section"}
        compactMobile
        breadcrumbs={[
          { title: "Sections", href: "/sections" },
          { title: section ? "Edit section" : "Add section" },
        ]}
        actions={
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              disabled={isPending}
              onClick={() => {
                if (!section) form.resetFields();
                router.push("/sections");
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
                {section ? "Update section" : "Add section"}
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
          section
            ? {
                name: section.name,
                status: section.status,
              }
            : sectionFormDefaults
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
        <SectionCard title="Section details" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              isRequird
              placeholder="Select"
              showSearch={false}
            />
          </div>
        </SectionCard>
      </Form>
    </div>
  );
}
