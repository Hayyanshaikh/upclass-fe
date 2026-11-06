"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { LuSave, LuX } from "react-icons/lu";
import {
  useStudentsControllerCreate,
  useStudentsControllerUpdate,
} from "@/app/api/endpoints";
import {
  CreateStudentDtoGender,
  CreateStudentDtoStatus,
  type CreateStudentDto,
  type CreateStudentDtoBloodGroup,
  type UpdateStudentDto,
} from "@/app/api/schemas";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Input from "@/components/ui/Input";
import PhotoUpload from "@/components/ui/PhotoUpload";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import { ROUTE_NAMES } from "@/constants/routes";
import { bloodGroupOptions, relationOptions } from "@/constants/student-form";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import type { StudentFormProps, StudentFormValues } from "@/types/student-form";
import { toOptions } from "@/utils/enum-options";
import { handleImageUpload } from "@/utils/handle-image-upload";

const genderOptions = toOptions(CreateStudentDtoGender);
const statusOptions = toOptions(CreateStudentDtoStatus);

export default function StudentForm({ student }: StudentFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<StudentFormValues>();
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const {
    options: classOptions,
    isLoading: isClassesLoading,
    isError: isClassesError,
  } = useClassDropdown();
  const { mutateAsync: createStudent, isPending: isCreating } =
    useStudentsControllerCreate();
  const { mutateAsync: updateStudent, isPending: isUpdating } =
    useStudentsControllerUpdate();
  const isPending = isCreating || isUpdating || isUploading;

  useEffect(() => {
    if (!student) return;
    form.setFieldsValue({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
      gender: student.gender ?? undefined,
      identityNumber: student.identityNumber ?? "",
      bloodGroup: student.bloodGroup ?? undefined,
      classId: student.classId,
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
  }, [form, student]);

  useEffect(() => {
    if (student) return;
    return () => form.resetFields();
  }, [form, student]);

  async function handleSubmit(values: StudentFormValues) {
    if (isPending) return;

    setSubmitError(null);
    setSubmitSuccess(null);
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
        setSubmitSuccess("Student updated successfully.");
        return;
      }

      const response = await createStudent({ data });
      setSuccessRedirect(
        ROUTE_NAMES.editStudent.replace(
          ":id",
          encodeURIComponent(response.data.id),
        ),
      );
      setSubmitSuccess("Student added successfully.");
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
        form.setFields([
          {
            name: "roll",
            errors: [message ?? "This roll number is already in use."],
          },
        ]);
        form.scrollToField("roll", { focus: true });
      }

      setSubmitError(
        message ?? `Unable to ${student ? "update" : "add"} student.`,
      );
    } finally {
      setIsUploading(false);
    }
  }

  function closeSuccessDialog() {
    form.resetFields();

    setSubmitSuccess(null);
    if (successRedirect) {
      router.push(successRedirect);
      setSuccessRedirect(null);
    }
  }

  return (
    <div>
      <PageHeader
        title={student ? "Edit student" : "Add student"}
        compactMobile
        breadcrumbs={[
          { title: "Students", href: "/students" },
          { title: student ? "Edit student" : "Add student" },
        ]}
        actions={
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              disabled={isPending}
              onClick={() => {
                if (!student) form.resetFields();
                router.push("/students");
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
                {student ? "Update student" : "Save student"}
              </span>
            </Button>
          </div>
        }
      />
      <Form
        form={form}
        layout="vertical"
        requiredMark={true}
        key={student?.id || "add"}
        initialValues={{
          status: CreateStudentDtoStatus.ACTIVE,
          relation: "Father",
        }}
        onFinish={(values) => void handleSubmit(values)}
        onValuesChange={() => setSubmitError(null)}
        scrollToFirstError
        className="flex flex-col gap-4"
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
        />

        <SectionCard title="Personal details" className="h-auto!">
          <div className="flex flex-col gap-5 sm:flex-row">
            <Form.Item name="photo">
              <PhotoUpload alt="Student photo preview" />
            </Form.Item>
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Academic details" className="h-auto!">
          {isClassesError && (
            <Alert
              type="error"
              role="alert"
              message="Unable to load classes. Please refresh and try again."
            />
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select
              name="classId"
              label="Class"
              options={classOptions}
              placeholder="Select class"
              isRequird
              loading={isClassesLoading}
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
              isRequird
              showSearch={false}
            />
          </div>
        </SectionCard>

        <SectionCard title="Guardian details" className="h-auto!">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <div className="md:col-span-3">
              <TextArea
                name="address"
                label="Address"
                placeholder="Enter home address"
              />
            </div>
          </div>
        </SectionCard>
      </Form>
    </div>
  );
}
