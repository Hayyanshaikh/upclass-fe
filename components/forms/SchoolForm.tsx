"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { LuSave, LuX } from "react-icons/lu";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/shared/PageHeader";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
import {
  useSchoolsControllerCreate,
  useSchoolsControllerFindAll,
  useSchoolsControllerUpdate,
} from "@/app/api/endpoints";
import type { CreateSchoolDto, UpdateSchoolDto } from "@/app/api/schemas";
import type { SchoolDto } from "@/app/api/schemas";

type SchoolFormValues = {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  adminName: string;
  adminEmail: string;
  adminPassword?: string;
};

type SchoolFormProps = {
  school?: SchoolDto;
};

export default function SchoolForm({ school }: SchoolFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<SchoolFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: createSchool, isPending: isCreating } =
    useSchoolsControllerCreate();
  const { mutateAsync: updateSchool, isPending: isUpdating } =
    useSchoolsControllerUpdate();
  const { refetch } = useSchoolsControllerFindAll();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!school) return;
    form.setFieldsValue({
      name: school.name,
      email: school.email ?? undefined,
      phone: school.phone ?? undefined,
      address: school.address ?? undefined,
      adminPassword: "",
    });
  }, [form, school]);

  useEffect(() => {
    if (school) return;
    return () => form.resetFields();
  }, [form, school]);

  async function handleSubmit(values: SchoolFormValues) {
    if (isSaving || isPending) return;

    setSubmitError(null);
    setSubmitSuccess(null);

    const baseData = {
      name: values.name.trim(),
      email: values.email?.trim() || null,
      phone: values.phone?.trim() || null,
      address: values.address?.trim() || null,
      adminName: values.adminName.trim(),
      adminEmail: values.adminEmail.trim(),
    };

    setIsSaving(true);
    try {
      if (school) {
        const data: UpdateSchoolDto = baseData;
        await updateSchool({ id: school.id, data });
        await refetch();
        setSubmitSuccess("School updated successfully.");
      } else {
        const data: CreateSchoolDto = {
          ...baseData,
          adminPassword: values.adminPassword ?? "",
        };
        const response = await createSchool({ data });
        setSuccessRedirect(
          `/schools/edit/${encodeURIComponent(response.data.id)}`,
        );
        setSubmitSuccess("School added successfully.");
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
        message ?? `Unable to ${school ? "update" : "add"} school.`,
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
        title={school ? `Edit ${school.name}` : "Add school"}
        compactMobile
        breadcrumbs={[
          { title: "Schools", href: "/schools" },
          { title: school ? "Edit school" : "Add school" },
        ]}
        actions={
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              disabled={isPending}
              onClick={() => router.push("/schools")}
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
                {school ? "Update school" : "Add school"}
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
          school
            ? {
                name: school.name,
                email: school.email ?? undefined,
                phone: school.phone ?? undefined,
                address: school.address ?? undefined,
                adminPassword: "",
              }
            : undefined
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
        <SectionCard title="School details" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              name="name"
              label="School name"
              placeholder="Enter school name"
              isRequird
              rules={[{ whitespace: true, message: "Enter a school name." }]}
            />
            <Input
              name="email"
              label="Email"
              placeholder="school@example.com"
              type="email"
              rules={[
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              ]}
            />
            <Input
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
            />
            <Input
              name="address"
              label="Address"
              placeholder="Enter school address"
            />
          </div>
        </SectionCard>

        <SectionCard title="Admin account" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              name="adminName"
              label="Admin name"
              placeholder="Enter admin name"
              isRequird
              rules={[{ whitespace: true, message: "Enter an admin name." }]}
            />
            <Input
              name="adminEmail"
              label="Admin email"
              placeholder="admin@example.com"
              isRequird
              type="email"
              rules={[
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              ]}
            />
            {school && (
              <Input
                name="adminPassword"
                label="Admin password"
                placeholder="Leave blank to keep current password"
                type="password"
                rules={[
                  {
                    pattern: /^(.{6,}|)$/,
                    message: "Enter at least 6 characters or leave blank.",
                  },
                ]}
              />
            )}

            {!school && (
              <div className="col-span-2">
                <Input
                  name="adminPassword"
                  label="Admin password"
                  placeholder="Enter admin password"
                  type="password"
                  isRequird
                  rules={[
                    { required: true, message: "Enter an admin password." },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters.",
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </SectionCard>
      </Form>
    </div>
  );
}
