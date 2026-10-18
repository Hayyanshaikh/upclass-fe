"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import dayjs from "dayjs";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import TextArea from "@/components/ui/TextArea";
import PhotoUpload from "@/components/ui/PhotoUpload";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import {
  teacherEmploymentOptions,
  teacherStatusOptions,
  teacherSubjects,
} from "@/constants/teachers";
import {
  assignedClassOptions,
  maritalStatusOptions,
  teacherGenderOptions,
} from "@/constants/teacher-form";
import { useTeacherStore } from "@/stores/teachers";
import type {
  Teacher,
  TeacherFormProps,
  TeacherFormValues,
} from "@/types/teacher";

export default function TeacherForm({ teacher }: TeacherFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<TeacherFormValues>();
  const records = useTeacherStore((state) => state.records);
  const saveTeacher = useTeacherStore((state) => state.saveTeacher);

  useEffect(() => {
    if (teacher) {
      const [firstName, ...lastName] = teacher.name.split(" ");
      form.setFieldsValue({
        ...teacher,
        firstName: teacher.firstName ?? firstName,
        lastName: teacher.lastName ?? lastName.join(" "),
        employeeId: teacher.id,
        dateOfBirth: teacher.dateOfBirth
          ? dayjs(teacher.dateOfBirth)
          : undefined,
        joiningDate: teacher.joiningDate
          ? dayjs(teacher.joiningDate)
          : undefined,
        assignedClasses: Object.fromEntries(
          teacher.classes.map((value) => [value, true]),
        ),
      });
    } else {
      const highestId = Math.max(
        0,
        ...records
          .map((record) => Number(record.id.replace(/^T-/, "")))
          .filter(Number.isFinite),
      );
      form.setFieldsValue({
        employeeId: "T-" + String(highestId + 1).padStart(3, "0"),
        employment: "Full-time",
        status: "Active",
        assignedClasses: {},
      });
    }
  }, [form, teacher, records]);

  function handleSubmit(values: TeacherFormValues) {
    const employeeId = values.employeeId.trim();
    if (
      records.some(
        (record) =>
          record.id.toLowerCase() === employeeId.toLowerCase() &&
          record.id !== teacher?.id,
      )
    ) {
      form.setFields([
        { name: "employeeId", errors: ["This employee ID is already in use"] },
      ]);
      form.scrollToField("employeeId", { focus: true });
      return;
    }
    const updatedTeacher: Teacher = {
      id: employeeId,
      name: values.firstName.trim() + " " + values.lastName.trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      gender: values.gender,
      identityNumber: values.identityNumber?.trim(),
      maritalStatus: values.maritalStatus,
      subject: values.subject,
      qualification: values.qualification?.trim(),
      joiningDate: values.joiningDate?.format("YYYY-MM-DD"),
      employment: values.employment,
      status: values.status,
      phone: values.phone.trim(),
      email: values.email?.trim(),
      address: values.address?.trim(),
      photo: values.photo,
      classes: Object.entries(values.assignedClasses ?? {})
        .filter(([, checked]) => checked)
        .map(([value]) => value),
    };
    saveTeacher(updatedTeacher, teacher?.id);
    if (!teacher) form.resetFields();
    router.push("/teachers");
  }

  const classOptions = [
    ...new Set([...assignedClassOptions, ...(teacher?.classes ?? [])]),
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      scrollToFirstError
      className="flex flex-col gap-4"
    >
      <SectionCard title="Personal details" className="h-auto!">
        <div className="flex flex-col gap-5 sm:flex-row">
          <Form.Item name="photo">
            <PhotoUpload alt="Teacher photo preview" />
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
              placeholder="Select gender"
              options={teacherGenderOptions}
            />
            <Input
              name="identityNumber"
              label="CNIC no."
              placeholder="00000-0000000-0"
              rules={[
                {
                  pattern: /^\d{5}-\d{7}-\d$/,
                  message: "Use format 00000-0000000-0",
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

      <SectionCard title="Professional details" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            name="employeeId"
            label="Employee ID"
            placeholder="Enter employee ID"
            disabled={Boolean(teacher)}
            isRequird
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter employee ID",
              },
              {
                pattern: /^[A-Za-z0-9-]+$/,
                message: "Use letters, numbers and hyphens",
              },
            ]}
          />
          <Select
            name="subject"
            label="Subject"
            placeholder="Select subject"
            options={teacherSubjects.map((value) => ({ label: value, value }))}
            isRequird
          />
          <Input
            name="qualification"
            label="Qualification"
            placeholder="Enter qualification, e.g. M.Ed."
          />
          <DatePicker name="joiningDate" label="Joining date" />
          <Select
            name="employment"
            label="Employment type"
            placeholder="Select employment type"
            options={teacherEmploymentOptions}
            showSearch={false}
            isRequird
          />
          <Select
            name="status"
            label="Status"
            placeholder="Select status"
            options={teacherStatusOptions}
            showSearch={false}
            isRequird
          />
        </div>
      </SectionCard>

      <SectionCard title="Contact details" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            name="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            placeholder="0300-0000000"
            isRequird
            rules={[
              {
                required: true,
                pattern: /^\+?[\d ()-]{7,20}$/,
                message: "Enter a valid phone number",
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

      <SectionCard title="Assigned classes" className="h-auto!">
        <fieldset>
          <legend className="sr-only">Assigned classes</legend>
          <div className="flex flex-wrap gap-3">
            {classOptions.map((value) => (
              <div
                key={value}
                className="rounded-sm border border-border px-4 py-3"
              >
                <Checkbox name={["assignedClasses", value]} label={value} />
              </div>
            ))}
          </div>
        </fieldset>
      </SectionCard>

      <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
        <Button variant="secondary" onClick={() => router.push("/teachers")}>
          Cancel
        </Button>
        <Button type="submit">
          {teacher ? "Update teacher" : "Save teacher"}
        </Button>
      </div>
    </Form>
  );
}
