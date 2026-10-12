"use client";

import { Form } from "antd";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { teacherEmploymentOptions, teacherStatusOptions, teacherSubjects } from "@/constants/teachers";
import type { TeacherFormProps } from "@/types/teacher";

export default function TeacherForm({ form, onSave }: TeacherFormProps) {
  return (
    <Form form={form} layout="vertical" onFinish={onSave} preserve={false}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            name="name"
            label="Teacher name"
            isRequird
            rules={[{ required: true, whitespace: true, message: "Enter the teacher’s name" }]}
          />
        </div>
        <Select
          name="subject"
          label="Subject"
          isRequird
          options={teacherSubjects.map((value) => ({ label: value, value }))}
        />
        <Input
          name="classes"
          label="Classes"
          placeholder="8-A, 9-C"
          isRequird
          rules={[{ required: true, pattern: /^\s*[\w-]+(?:\s*,\s*[\w-]+)*\s*$/, message: "Enter classes separated by commas, e.g. 8-A, 9-C" }]}
        />
        <Input
          name="phone"
          label="Phone"
          type="tel"
          isRequird
          rules={[{ required: true, pattern: /^\+?[\d ()-]{7,20}$/, message: "Enter a valid phone number" }]}
        />
        <Select name="employment" label="Employment" isRequird options={teacherEmploymentOptions} showSearch={false} />
        <Select name="status" label="Status" isRequird options={teacherStatusOptions} showSearch={false} />
      </div>
      <p className="mt-4 text-xs text-gray">Preview only. Changes reset when this page is refreshed.</p>
    </Form>
  );
}
