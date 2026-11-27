"use client";

import { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { LuCheck, LuCopy, LuPlus, LuTrash2 } from "react-icons/lu";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import MobileTeacherDocumentForm from "@/components/mobile/forms/MobileTeacherDocumentForm";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Input from "@/components/ui/Input";
import PhotoUpload from "@/components/ui/PhotoUpload";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import {
  CreateTeacherDtoEmploymentType,
  CreateTeacherDtoGender,
  CreateTeacherDtoMaritalStatus,
  TeachersControllerFindAllStatus,
  type CreateTeacherDto,
  type TeacherDto,
  type UpdateTeacherDto,
} from "@/app/api/schemas";
import {
  useTeachersControllerCreate,
  useTeachersControllerUpdate,
} from "@/app/api/endpoints";
import type {
  TeacherDocumentFormValue,
  TeacherFormValues,
} from "@/types/teacher";
import { toOptions } from "@/utils/enum-options";
import { handleImageUpload } from "@/utils/handle-image-upload";

const genderOptions = toOptions(CreateTeacherDtoGender);
const maritalStatusOptions = toOptions(CreateTeacherDtoMaritalStatus);
const employmentTypeOptions = toOptions(
  CreateTeacherDtoEmploymentType,
  "hyphen",
);
const statusOptions = toOptions(TeachersControllerFindAllStatus);

type MobileTeacherFormProps = {
  open: boolean;
  teacher?: TeacherDto;
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

function getDocumentFileName(document: TeacherDocumentFormValue) {
  return (
    document.file?.[0]?.name ||
    document.documentUrl?.split("/").pop()?.split("?")[0] ||
    "No file"
  );
}

export default function MobileTeacherForm({
  open,
  teacher,
  onClose,
  onSaved,
  onDelete,
}: MobileTeacherFormProps) {
  const [form] = Form.useForm<TeacherFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentList, setDocumentList] = useState<TeacherDocumentFormValue[]>(
    [],
  );
  const [documentFormOpen, setDocumentFormOpen] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createTeacher, isPending: isCreating } =
    useTeachersControllerCreate();
  const { mutateAsync: updateTeacher, isPending: isUpdating } =
    useTeachersControllerUpdate();
  const isPending = isCreating || isUpdating || isUploading;

  useEffect(() => {
    if (!open) {
      setDocumentFormOpen(false);
      return;
    }

    setSubmitError(null);
    setDocumentFormOpen(false);

    if (teacher) {
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
        bankName: teacher.bankName ?? "",
        accountNumber: teacher.accountNumber ?? "",
      });
      setDocumentList(
        (teacher.documents ?? []).map((document, index) => ({
          documentName: document.documentName ?? "",
          documentUrl: document.documentUrl ?? "",
          file: document.documentUrl
            ? [
                {
                  uid: `-${index + 1}`,
                  name:
                    document.documentUrl.split("/").pop()?.split("?")[0] ||
                    "Uploaded file",
                  status: "done",
                  url: document.documentUrl,
                },
              ]
            : [],
        })),
      );
      return;
    }

    form.resetFields();
    setDocumentList([]);
  }, [open, teacher, form]);

  function handleAddDocument(values: TeacherDocumentFormValue) {
    setDocumentList((previous) => [...previous, values]);
    setDocumentFormOpen(false);
  }

  function removeDocument(index: number) {
    setDocumentList((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function handleSubmit(values: TeacherFormValues) {
    if (isPending) return;

    setSubmitError(null);
    setIsUploading(values.image instanceof File);

    const documents = await Promise.all(
      documentList.map(async (document) => {
        const file = document.file?.[0]?.originFileObj;

        if (!(file instanceof File)) {
          return {
            documentName: document.documentName.trim(),
            documentUrl: document.documentUrl,
          };
        }

        const uploaded = await handleImageUpload(file);

        return {
          documentName: document.documentName.trim(),
          documentUrl: uploaded.url,
        };
      }),
    );

    try {
      const image = await handleImageUpload(
        values.image,
        teacher?.imagePublicId,
      );

      const commonData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() || null,
        image: image.url,
        imagePublicId: image.publicId,
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
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        documents: documents || [],
      };

      if (teacher) {
        const data: UpdateTeacherDto = commonData;

        await updateTeacher({ id: teacher.id, data });
        onSaved("Teacher updated successfully.");
        return;
      }

      const data: CreateTeacherDto = commonData;
      const response = await createTeacher({ data });

      if (response.temporaryPassword) {
        setCopyStatus("idle");
        setTemporaryPassword(response.temporaryPassword);
        return;
      }

      onSaved("Teacher added successfully.");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        const body = error.response.data as
          | { message?: string; data?: { errors?: string[] } }
          | undefined;
        const message =
          body?.data?.errors?.[0] ?? body?.message ?? "Already exists.";
        const lowerMessage = message.toLowerCase();

        const field = lowerMessage.includes("email")
          ? "email"
          : lowerMessage.includes("username")
            ? "firstName"
            : lowerMessage.includes("employee")
              ? "employeeId"
              : lowerMessage.includes("cnic")
                ? "cnicNo"
                : undefined;

        if (field) {
          form.setFields([{ name: field, errors: [message] }]);
          form.scrollToField(field, { focus: true });
        }
      }

      setSubmitError(
        getErrorMessage(
          error,
          `Unable to ${teacher ? "update" : "add"} teacher.`,
        ),
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

  function closePasswordSheet() {
    setTemporaryPassword(null);
    setCopyStatus("idle");
    onSaved("Teacher added successfully.");
  }

  return (
    <>
      <MobileSheet
        open={open}
        onClose={onClose}
        title={teacher ? "Edit teacher" : "Add teacher"}
        closeLabel="Close"
      >
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
          className="mt-4 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            <h3 className="text-sm font-semibold text-dark">
              Personal details
            </h3>
            <Form.Item name="image">
              <PhotoUpload maxSizeMB={0.05} alt="Teacher photo preview" />
            </Form.Item>
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

            <h3 className="text-sm font-semibold text-dark">
              Professional details
            </h3>
            <Input
              name="employeeId"
              label="Employee ID"
              placeholder="Assigned automatically"
              disabled={!!teacher}
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

            <h3 className="text-sm font-semibold text-dark">Bank details</h3>
            <Input
              name="bankName"
              label="Bank name"
              placeholder="Enter bank name"
            />
            <Input
              name="accountNumber"
              label="Account number"
              placeholder="Enter account number"
              rules={[
                {
                  pattern: /^\d{10,20}$/,
                  message: "Account number must contain 10–20 digits.",
                },
              ]}
            />

            <h3 className="text-sm font-semibold text-dark">
              Contact details
            </h3>
            <Input
              name="phone"
              label="Phone"
              type="tel"
              autoComplete="tel"
              placeholder="0300-0000000"
              disabled={!!teacher?.phone}
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
              disabled={!!teacher}
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
            <TextArea
              name="address"
              label="Address"
              placeholder="Enter home address"
              rows={3}
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-dark">Documents</h3>
                <Button onClick={() => setDocumentFormOpen(true)}>
                  <LuPlus size={18} aria-hidden="true" />
                  Add document
                </Button>
              </div>

              {documentList.length === 0 ? (
                <p className="rounded-lg border border-border bg-background p-4 text-center text-xs text-gray">
                  No documents added yet.
                </p>
              ) : (
                <ul role="list" className="flex flex-col gap-2">
                  {documentList.map((document, index) => (
                    <li
                      key={`${document.documentName}-${index}`}
                      className="flex items-start gap-2 rounded-lg border border-border bg-background p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-dark">
                          {document.documentName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray">
                          {getDocumentFileName(document)}
                        </p>
                      </div>
                      <IconButton
                        variant="danger"
                        label={`Remove ${document.documentName}`}
                        onClick={() => removeDocument(index)}
                      >
                        <LuTrash2 size={18} aria-hidden="true" />
                      </IconButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
            {teacher && onDelete && (
              <IconButton
                label="Delete teacher"
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

      <MobileSheet
        open={temporaryPassword !== null}
        onClose={closePasswordSheet}
        title="Temporary password"
        closeLabel="Close"
      >
        <p className="mt-1 text-sm leading-5 text-gray">
          Copy this password to sign in as the teacher. It is shown only once.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-foreground px-3 py-1">
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

        <p role="status" aria-live="polite" className="mt-2 text-xs text-gray">
          {copyStatus === "copied"
            ? "Copied to clipboard."
            : copyStatus === "error"
              ? "Automatic copy failed. The password is selected; copy it manually."
              : "Use the copy button before continuing."}
        </p>

        <div className="mt-5">
          <Button fullWidth onClick={closePasswordSheet}>
            Done
          </Button>
        </div>
      </MobileSheet>

      <MobileTeacherDocumentForm
        open={documentFormOpen}
        onClose={() => setDocumentFormOpen(false)}
        onAdd={handleAddDocument}
      />
    </>
  );
}
