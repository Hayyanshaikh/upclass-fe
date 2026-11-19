"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { LuTrash2 } from "react-icons/lu";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Input from "@/components/ui/Input";
import PhotoUpload from "@/components/ui/PhotoUpload";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import { bloodGroupOptions, relationOptions } from "@/constants/student-form";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useClassSectionDropdown } from "@/hooks/useClassSectionDropdown";
import {
  CreateStudentDtoGender,
  CreateStudentDtoStatus,
  type CreateStudentDto,
  type CreateStudentDtoBloodGroup,
  type StudentDto,
  type UpdateStudentDto,
} from "@/app/api/schemas";
import {
  useStudentsControllerCreate,
  useStudentsControllerUpdate,
} from "@/app/api/endpoints";
import type { StudentFormValues } from "@/types/student-form";
import { toOptions } from "@/utils/enum-options";
import { handleImageUpload } from "@/utils/handle-image-upload";

const genderOptions = toOptions(CreateStudentDtoGender);
const statusOptions = toOptions(CreateStudentDtoStatus);

type MobileStudentFormProps = {
  open: boolean;
  student?: StudentDto;
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

export default function MobileStudentForm({
  open,
  student,
  onClose,
  onSaved,
  onDelete,
}: MobileStudentFormProps) {
  const [form] = Form.useForm<StudentFormValues>();
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    options: classOptions,
    isLoading: isClassesLoading,
    isError: isClassesError,
  } = useClassDropdown();
  const selectedClassId = Form.useWatch("classId", form);
  const {
    options: sectionOptions,
    isLoading: isSectionsLoading,
    isError: isSectionsError,
  } = useClassSectionDropdown(selectedClassId);
  const { mutateAsync: createStudent, isPending: isCreating } =
    useStudentsControllerCreate();
  const { mutateAsync: updateStudent, isPending: isUpdating } =
    useStudentsControllerUpdate();
  const isPending = isCreating || isUpdating || isUploading;

  useEffect(() => {
    if (!open) return;

    setSubmitError(null);

    if (student) {
      form.setFieldsValue({
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
        gender: student.gender ?? undefined,
        identityNumber: student.identityNumber ?? "",
        bloodGroup: student.bloodGroup ?? undefined,
        classId: student.classId,
        classSectionId: student.classSectionId ?? undefined,
        roll: student.roll,
        admissionDate: student.admissionDate
          ? dayjs(student.admissionDate)
          : null,
        status: student.status,
        guardian: student.guardian,
        relation: student.relation,
        phone: student.phone,
        email: student.email ?? "",
        address: student.address ?? "",
        photo: student.photo ?? null,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      status: CreateStudentDtoStatus.ACTIVE,
      relation: "Father",
    });
  }, [open, student, form]);

  async function handleSubmit(values: StudentFormValues) {
    if (isPending) return;

    setSubmitError(null);
    setIsUploading(values.photo instanceof File);

    try {
      const photo = await handleImageUpload(values.photo);
      const data: CreateStudentDto = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD") ?? null,
        gender: values.gender ?? null,
        identityNumber: values.identityNumber?.trim() || null,
        bloodGroup: (values.bloodGroup || null) as CreateStudentDtoBloodGroup,
        classId: values.classId,
        classSectionId: values.classSectionId,
        roll: values.roll.trim(),
        admissionDate: values.admissionDate?.format("YYYY-MM-DD") ?? null,
        status: values.status,
        guardian: values.guardian.trim(),
        relation: values.relation,
        phone: values.phone.trim(),
        email: values.email?.trim() || null,
        address: values.address?.trim() || null,
        photo: photo.url,
      };

      if (student) {
        const updateData: UpdateStudentDto = data;
        await updateStudent({ id: student.id, data: updateData });
        onSaved("Student updated successfully.");
        return;
      }

      await createStudent({ data });
      onSaved("Student added successfully.");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        const body = error.response.data as
          | { message?: string; data?: { errors?: string[] } }
          | undefined;
        const message =
          body?.data?.errors?.[0] ??
          body?.message ??
          "This roll number is already in use.";

        form.setFields([{ name: "roll", errors: [message] }]);
        form.scrollToField("roll", { focus: true });
      }

      setSubmitError(
        getErrorMessage(
          error,
          `Unable to ${student ? "update" : "add"} student.`,
        ),
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title={student ? "Edit student" : "Add student"}
      closeLabel="Close"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: CreateStudentDtoStatus.ACTIVE,
          relation: "Father",
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
          <Form.Item name="photo">
            <PhotoUpload alt="Student photo preview" />
          </Form.Item>
          <Input
            name="firstName"
            label="First name"
            placeholder="Enter first name"
            autoComplete="given-name"
            isRequird
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter first name",
              },
            ]}
          />
          <Input
            name="lastName"
            label="Last name"
            placeholder="Enter last name"
            autoComplete="family-name"
            isRequird
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter last name",
              },
            ]}
          />
          <DatePicker name="dateOfBirth" label="Date of birth" pastOnly />
          <Select
            name="gender"
            label="Gender"
            options={genderOptions}
            placeholder="Select gender"
          />
          <Input
            name="identityNumber"
            label="B-Form / CNIC no."
            placeholder="00000-0000000-0"
            rules={[
              {
                pattern: /^\d{5}-\d{7}-\d$/,
                message: "Use format 00000-0000000-0",
              },
            ]}
          />
          <Select
            name="bloodGroup"
            label="Blood group"
            options={bloodGroupOptions}
            placeholder="Select blood group"
          />

          <h3 className="text-sm font-semibold text-dark">
            Academic details
          </h3>
          {isClassesError && (
            <p
              role="alert"
              className="rounded-md bg-danger/10 px-3 py-2 text-sm font-semibold text-danger"
            >
              Unable to load classes. Please refresh and try again.
            </p>
          )}
          {isSectionsError && (
            <p
              role="alert"
              className="rounded-md bg-danger/10 px-3 py-2 text-sm font-semibold text-danger"
            >
              Unable to load sections. Please refresh and try again.
            </p>
          )}
          <Select
            name="classId"
            label="Class"
            options={classOptions}
            placeholder="Select class"
            loading={isClassesLoading}
            isRequird
            onChange={() => form.setFieldValue("classSectionId", undefined)}
          />
          <Select
            name="classSectionId"
            label="Section"
            options={sectionOptions}
            placeholder={
              selectedClassId ? "Select section" : "Select class first"
            }
            loading={isSectionsLoading}
            disabled={!selectedClassId}
            isRequird
          />
          <Input
            name="roll"
            label="Roll number"
            placeholder="Enter roll number"
            isRequird
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter roll number",
              },
            ]}
          />
          <DatePicker name="admissionDate" label="Admission date" />
          <Select
            name="status"
            label="Status"
            options={statusOptions}
            placeholder="Select status"
            showSearch={false}
            isRequird
          />

          <h3 className="text-sm font-semibold text-dark">
            Guardian details
          </h3>
          <Input
            name="guardian"
            label="Guardian name"
            placeholder="Enter guardian name"
            isRequird
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter guardian name",
              },
            ]}
          />
          <Select
            name="relation"
            label="Relation"
            options={relationOptions}
            placeholder="Select relation"
            isRequird
          />
          <Input
            name="phone"
            label="Phone"
            type="tel"
            placeholder="0300-0000000"
            isRequird
            rules={[
              {
                required: true,
                pattern: /^03\d{2}-?\d{7}$/,
                message: "Enter a valid phone, e.g. 0300-0000000",
              },
            ]}
          />
          <Input
            name="email"
            label="Email"
            placeholder="Enter email address"
            type="email"
            autoComplete="email"
            rules={[
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            ]}
          />
          <TextArea
            name="address"
            label="Address"
            placeholder="Enter home address"
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
          {student && onDelete && (
            <IconButton
              label="Delete student"
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
