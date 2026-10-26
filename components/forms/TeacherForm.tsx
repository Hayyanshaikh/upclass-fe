"use client";

import { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { LuCheck, LuCopy, LuSave, LuX } from "react-icons/lu";
import {
  useTeachersControllerCreate,
  useTeachersControllerUpdate,
} from "@/app/api/endpoints";
import {
  CreateTeacherDtoEmploymentType,
  CreateTeacherDtoGender,
  CreateTeacherDtoMaritalStatus,
  TeachersControllerFindAllStatus,
  type CreateTeacherDto,
  type UpdateTeacherDto,
} from "@/app/api/schemas";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import PhotoUpload from "@/components/ui/PhotoUpload";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import type { TeacherFormProps, TeacherFormValues } from "@/types/teacher";
import { toOptions } from "@/utils/enum-options";
import { handleImageUpload } from "@/utils/handle-image-upload";

const genderOptions = toOptions(CreateTeacherDtoGender);
const maritalStatusOptions = toOptions(CreateTeacherDtoMaritalStatus);
const employmentTypeOptions = toOptions(
  CreateTeacherDtoEmploymentType,
  "hyphen",
);
const statusOptions = toOptions(TeachersControllerFindAllStatus);

export default function TeacherForm({ teacher, onSaved }: TeacherFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<TeacherFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [passwordDialogPending, setPasswordDialogPending] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createTeacher, isPending: isCreating } =
    useTeachersControllerCreate();
  const { mutateAsync: updateTeacher, isPending: isUpdating } =
    useTeachersControllerUpdate();
  const isPending = isCreating || isUpdating || isUploading;

  useEffect(() => {
    if (!teacher) return;
    form.setFieldsValue({
      firstName: teacher.firstName,
      lastName: teacher.lastName ?? "",
      employeeId: teacher.employeeId ?? "",
      image: teacher.image ?? "",
      dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : null,
      gender: teacher.gender,
      cnicNo: teacher.cnicNo ?? "",
      maritalStatus: teacher.maritalStatus,
      qualification: teacher.qualification ?? "",
      joiningDate: teacher.joiningDate ? dayjs(teacher.joiningDate) : null,
      employmentType: teacher.employmentType,
      status:
        teacher.isActive === null
          ? undefined
          : teacher.isActive
            ? TeachersControllerFindAllStatus.ACTIVE
            : TeachersControllerFindAllStatus.INACTIVE,
      phone: teacher.phone ?? "",
      email: teacher.email ?? "",
      address: teacher.address ?? "",
    });
  }, [form, teacher]);

  useEffect(() => {
    if (teacher) return;
    return () => form.resetFields();
  }, [form, teacher]);

  async function handleSubmit(values: TeacherFormValues) {
    if (isPending) return;

    setSubmitError(null);
    setSubmitSuccess(null);
    setIsUploading(values.image instanceof File);

    try {
      const imageUrl = await handleImageUpload(values.image);

      const commonData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() || null,
        image: imageUrl || "",
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD") ?? null,
        gender: values.gender ?? null,
        employeeId: values.employeeId?.trim() || null,
        cnicNo: values.cnicNo?.trim() || null,
        maritalStatus: values.maritalStatus ?? null,
        qualification: values.qualification?.trim() || null,
        joiningDate: values.joiningDate?.format("YYYY-MM-DD") ?? null,
        employmentType: values.employmentType ?? null,
        isActive:
          values.status === undefined
            ? null
            : values.status === TeachersControllerFindAllStatus.ACTIVE,
        phone: values.phone?.trim() || null,
        email: values.email.trim(),
        address: values.address?.trim() || null,
      };

      if (teacher) {
        const data: UpdateTeacherDto = {
          ...commonData,
        };

        await updateTeacher({ id: teacher.id, data });
        await onSaved?.();

        setSubmitSuccess("Teacher updated successfully.");
        return;
      }

      const data: CreateTeacherDto = commonData;
      const response = await createTeacher({ data });

      setTemporaryPassword(response.temporaryPassword ?? null);
      setCopyStatus("idle");
      setSuccessRedirect(
        `/teachers/edit/${encodeURIComponent(response.data.id)}`,
      );
      setSubmitSuccess("Teacher added successfully.");
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

      if (isAxiosError(error) && error.response?.status === 409) {
        const lowerMessage = message?.toLowerCase();

        const field = lowerMessage?.includes("email")
          ? "email"
          : lowerMessage?.includes("username")
            ? "firstName"
            : lowerMessage?.includes("employee")
              ? "employeeId"
              : lowerMessage?.includes("cnic")
                ? "cnicNo"
                : undefined;

        if (field) {
          form.setFields([
            { name: field, errors: [message ?? "Already exists."] },
          ]);
          form.scrollToField(field, { focus: true });
        }
      }

      setSubmitError(
        message ?? `Unable to ${teacher ? "update" : "add"} teacher.`,
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function copyTemporaryPassword() {
    if (!temporaryPassword) return;

    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopyStatus("copied");
    } catch {
      passwordInputRef.current?.select();
      setCopyStatus("error");
    }
  }

  function closeSuccessDialog() {
    setSubmitSuccess(null);
    if (temporaryPassword) {
      setPasswordDialogPending(true);
    } else if (successRedirect) {
      router.push(successRedirect);
      setSuccessRedirect(null);
    }
  }

  function finishPasswordDialog() {
    setPasswordDialogOpen(false);
    setTemporaryPassword(null);
    setCopyStatus("idle");
    if (successRedirect) {
      router.push(successRedirect);
      setSuccessRedirect(null);
    }
  }

  return (
    <div>
      <PageHeader
        title={
          teacher
            ? [teacher.firstName, teacher.lastName].filter(Boolean).join(" ")
            : "Add teacher"
        }
        compactMobile
        breadcrumbs={[
          { title: "Teachers", href: "/teachers" },
          { title: teacher ? "Edit teacher" : "Add teacher" },
        ]}
        actions={
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              disabled={isPending}
              onClick={() => {
                if (!teacher) form.resetFields();
                router.push("/teachers");
              }}
            >
              <LuX size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Cancel</span>
            </Button>
            <Button
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              loading={isPending}
              onClick={() => form.submit()}
            >
              <LuSave size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">
                {teacher ? "Update teacher" : "Add teacher"}
              </span>
            </Button>
          </div>
        }
      />
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          employmentType: CreateTeacherDtoEmploymentType.FULL_TIME,
          status: TeachersControllerFindAllStatus.ACTIVE,
        }}
        onFinish={(values) => void handleSubmit(values)}
        onValuesChange={() => setSubmitError(null)}
        scrollToFirstError
        requiredMark={false}
        className="flex flex-col gap-6"
      >
        <ErrorDialog
          open={submitError !== null}
          message={submitError ?? ""}
          onClose={() => setSubmitError(null)}
        />
        <SuccessDialog
          open={submitSuccess !== null}
          message={submitSuccess ?? ""}
          onClose={closeSuccessDialog}
          afterClose={() => {
            if (passwordDialogPending) {
              setPasswordDialogPending(false);
              setPasswordDialogOpen(true);
            }
          }}
        />
        <Dialog
          open={passwordDialogOpen}
          title="Temporary password"
          onClose={() => passwordInputRef.current?.focus()}
          onConfirm={finishPasswordDialog}
          closable={false}
          width={400}
          footer={
            <div className="flex justify-end">
              <Button
                disabled={copyStatus === "idle"}
                onClick={finishPasswordDialog}
              >
                Okay
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-sm text-dark">
            <p>
              Copy this password to sign in as the teacher. It is shown only
              once.
            </p>
            <div className="flex items-center gap-2 rounded-md border border-border bg-foreground px-3 py-1">
              <input
                ref={passwordInputRef}
                aria-label="Temporary password"
                type="text"
                value={temporaryPassword ?? ""}
                readOnly
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent font-medium text-dark outline-none"
              />
              <Button
                variant="text"
                className="size-9! shrink-0 p-0! text-primary!"
                onClick={() => void copyTemporaryPassword()}
              >
                {copyStatus === "copied" ? (
                  <LuCheck size={18} aria-hidden="true" />
                ) : (
                  <LuCopy size={18} aria-hidden="true" />
                )}
                <span className="sr-only">Copy temporary password</span>
              </Button>
            </div>
            <p role="status" aria-live="polite" className="text-gray">
              {copyStatus === "copied"
                ? "Copied to clipboard. Click Okay to continue to Edit teacher."
                : copyStatus === "error"
                  ? "Automatic copy failed. The password is selected; press Ctrl+C, then click Okay."
                  : "Use the copy button before continuing."}
            </p>
          </div>
        </Dialog>
        <SectionCard title="Personal details" autoHeight>
          <div className="flex flex-col gap-5 sm:flex-row">
            <Form.Item name="image">
              <PhotoUpload maxSizeMB={0.05} alt="Teacher photo preview" />
            </Form.Item>
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Input
                name="firstName"
                label="First name"
                placeholder="Enter first name"
                autoComplete="given-name"
                isRequird
                rules={[{ whitespace: true, message: "Enter first name." }]}
              />
              <Input
                name="lastName"
                label="Last name"
                placeholder="Enter last name"
                autoComplete="family-name"
              />
              <DatePicker name="dateOfBirth" label="Date of birth" pastOnly />
              <Select
                name="gender"
                label="Gender"
                placeholder="Select gender"
                options={genderOptions}
              />
              <Input
                name="cnicNo"
                label="CNIC no."
                placeholder="00000-0000000-0"
                rules={[
                  {
                    pattern: /^\d{5}-\d{7}-\d$/,
                    message: "Use format 00000-0000000-0.",
                  },
                ]}
              />
              <Select
                name="maritalStatus"
                label="Marital status"
                placeholder="Select marital status"
                options={maritalStatusOptions}
              />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Professional details" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              name="employeeId"
              label="Employee ID"
              placeholder={
                teacher ? "Enter employee ID" : "Assigned automatically"
              }
              disabled={!teacher}
              rules={[
                {
                  pattern: /^[A-Za-z0-9-]+$/,
                  message: "Use letters, numbers and hyphens.",
                },
              ]}
            />
            <Input
              name="qualification"
              label="Qualification"
              placeholder="Enter qualification, e.g. M.Ed."
            />
            <DatePicker name="joiningDate" label="Joining date" />
            <Select
              name="employmentType"
              label="Employment type"
              placeholder="Select employment type"
              options={employmentTypeOptions}
              showSearch={false}
            />
            <Select
              name="status"
              label="Status"
              placeholder="Select status"
              options={statusOptions}
              showSearch={false}
            />
          </div>
        </SectionCard>
        <SectionCard title="Contact details" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              name="phone"
              label="Phone"
              type="tel"
              autoComplete="tel"
              placeholder="0300-0000000"
              rules={[
                {
                  pattern: /^\+?[\d ()-]{7,20}$/,
                  message: "Enter a valid phone number.",
                },
              ]}
            />
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="name@school.edu"
              autoComplete="email"
              isRequird
              rules={[
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              ]}
            />
            <div className="md:col-span-2">
              <TextArea
                name="address"
                label="Address"
                placeholder="Enter home address"
                rows={3}
              />
            </div>
          </div>
        </SectionCard>
      </Form>
    </div>
  );
}
