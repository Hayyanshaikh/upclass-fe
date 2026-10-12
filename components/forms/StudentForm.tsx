"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import TextArea from "@/components/ui/TextArea";
import PhotoUpload from "@/components/ui/PhotoUpload";
import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import {
  bloodGroupOptions,
  classOptions,
  genderOptions,
  relationOptions,
  sectionOptions,
  statusOptions,
} from "@/constants/student-form";
import type { StudentFormProps, StudentFormValues } from "@/types/student-form";

dayjs.extend(customParseFormat);

function parseDate(value?: string) {
  if (!value) return undefined;
  const date = dayjs(value, ["YYYY-MM-DD", "DD/MM/YYYY"], true);
  return date.isValid() ? date : undefined;
}

export default function StudentForm({
  initialValues,
  student,
  onSave,
}: StudentFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<StudentFormValues>();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const editValues = useMemo(() => {
    if (!student) return undefined;
    const [firstName, ...lastName] = student.name.split(" ");
    const [className, section] = student.className.split("-");
    return {
      firstName: student.firstName ?? firstName,
      lastName: student.lastName ?? lastName.join(" "),
      dateOfBirth: parseDate(student.dateOfBirth),
      gender: student.gender,
      identityNumber: student.identityNumber,
      bloodGroup: student.bloodGroup,
      className,
      section,
      roll: student.roll,
      admissionDate: parseDate(student.admissionDate),
      status: student.status || "Active",
      guardian: student.guardian,
      relation: student.relation,
      phone: student.phone,
      email: student.email,
      address: student.address,
      photo: student.photo,
    };
  }, [student]);

  // Apply prefills after hydration so server and first client render agree.
  useEffect(() => {
    form.setFieldsValue(
      initialValues || editValues || { status: "Active", relation: "Father" },
    );
  }, [form, initialValues, editValues]);

  async function handleSubmit(values: StudentFormValues) {
    if (!onSave) {
      setMessage(
        "Saving students is not connected yet. Your entered details are still available in this form.",
      );
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await onSave(values);
      router.push("/students");
    } catch {
      setMessage("Could not save the student. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={true}
      key={student?.id || "add"}
      onFinish={handleSubmit}
      scrollToFirstError
      className="flex flex-col gap-4"
    >
      <SectionCard title="Personal details" className="h-auto!">
        <div className="flex flex-col gap-5 sm:flex-row">
          <Form.Item name="photo">
            <PhotoUpload />
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            name="className"
            label="Class"
            options={classOptions}
            placeholder="Select class"
            isRequird
          />
          <Select
            name="section"
            label="Section"
            options={sectionOptions}
            placeholder="Select section"
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
            isRequird
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

      {message && (
        <p
          role="status"
          className="rounded-sm border border-border bg-background p-3 text-sm text-gray"
        >
          {message}
        </p>
      )}
      <div className="flex justify-end gap-3 pb-4">
        <Button
          variant="secondary"
          onClick={() => router.push("/students")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {student ? "Update student" : "Save student"}
        </Button>
      </div>
    </Form>
  );
}
