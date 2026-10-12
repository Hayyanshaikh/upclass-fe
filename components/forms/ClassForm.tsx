"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import { LuTrash2 } from "react-icons/lu";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import { classGradeOptions, academicYearOptions, classStatusOptions, classFormDefaults } from "@/constants/classes";
import { teacherSubjects } from "@/constants/teachers";
import { useTeacherStore } from "@/stores/teachers";
import { useClassStore } from "@/stores/classes";
import type { ClassFormError, ClassFormProps, ClassFormValues, ClassSubject } from "@/types/classes";

export default function ClassForm({ schoolClass }: ClassFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<ClassFormValues>();
  const teachers = useTeacherStore((state) => state.records);
  const saveClass = useClassStore((state) => state.saveClass);
  const teacherOptions = teachers.map((teacher) => ({ label: teacher.name, value: teacher.id }));
  const subjectOptions = [...new Set([...teacherSubjects, ...(schoolClass?.subjects.map((item) => item.subject) ?? [])])].map((value) => ({ label: value, value }));

  useEffect(() => {
    if (!schoolClass) return;
    form.setFieldsValue({
      ...schoolClass,
      assistantTeacherId: schoolClass.assistantTeacherId || "",
      subjects: schoolClass.subjects.length ? schoolClass.subjects : [{}, {}, {}],
    });
  }, [form, schoolClass]);

  function handleSubmit(values: ClassFormValues) {
    const section = values.section.trim().toUpperCase();
    const errors: ClassFormError[] = [];
    const capacity = Number(values.capacity);
    if (useClassStore.getState().records.some((record) => record.id !== schoolClass?.id && record.grade === values.grade && record.section === section && record.academicYear === values.academicYear)) {
      errors.push({ name: ["section"], errors: ["This grade and section already exist for the selected academic year"] });
    }
    if (capacity < (schoolClass?.students ?? 0)) {
      errors.push({ name: ["capacity"], errors: ["Capacity cannot be lower than the current student count"] });
    }
    if (!teachers.some((teacher) => teacher.id === values.teacherId)) {
      errors.push({ name: ["teacherId"], errors: ["Select an available class teacher"] });
    }
    if (values.assistantTeacherId && values.assistantTeacherId === values.teacherId) {
      errors.push({ name: ["assistantTeacherId"], errors: ["Choose a different assistant teacher"] });
    }
    if (values.assistantTeacherId && !teachers.some((teacher) => teacher.id === values.assistantTeacherId)) {
      errors.push({ name: ["assistantTeacherId"], errors: ["Select an available assistant teacher"] });
    }
    const subjects: ClassSubject[] = [];
    const selectedSubjects = new Set<string>();
    (values.subjects ?? []).forEach((row, index) => {
      if (!row.subject && !row.teacherId && !row.periodsPerWeek) return;
      if (!row.subject) errors.push({ name: ["subjects", index, "subject"], errors: ["Select a subject"] });
      if (!row.teacherId || !teachers.some((teacher) => teacher.id === row.teacherId)) errors.push({ name: ["subjects", index, "teacherId"], errors: ["Select an available teacher"] });
      if (!row.periodsPerWeek) errors.push({ name: ["subjects", index, "periodsPerWeek"], errors: ["Enter periods per week"] });
      if (row.subject && selectedSubjects.has(row.subject)) errors.push({ name: ["subjects", index, "subject"], errors: ["This subject is already assigned"] });
      if (row.subject) selectedSubjects.add(row.subject);
      if (row.subject && row.teacherId && row.periodsPerWeek) subjects.push({ subject: row.subject, teacherId: row.teacherId, periodsPerWeek: Number(row.periodsPerWeek) });
    });
    if (errors.length) {
      form.setFields(errors);
      form.scrollToField(errors[0].name, { focus: true });
      return;
    }
    saveClass({
      id: schoolClass?.id ?? crypto.randomUUID(),
      grade: values.grade,
      section,
      room: values.room.trim(),
      capacity,
      academicYear: values.academicYear,
      status: values.status,
      teacherId: values.teacherId,
      assistantTeacherId: values.assistantTeacherId || undefined,
      students: schoolClass?.students ?? 0,
      subjects,
    });
    if (!schoolClass) {
      form.resetFields();
    }
    router.push("/classes");
  }

  return (
    <Form form={form} initialValues={classFormDefaults} layout="vertical" onFinish={handleSubmit} scrollToFirstError className="flex flex-col gap-4">
      <SectionCard title="Class details" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select name="grade" label="Grade" placeholder="Select grade" options={classGradeOptions} isRequird />
          <Input name="section" label="Section" placeholder="A" isRequird rules={[{ required: true, pattern: /^\s*[A-Za-z]+\s*$/, message: "Enter a section, e.g. A" }]} />
          <Input name="room" label="Room" placeholder="Enter room, e.g. Room 12" isRequird rules={[{ required: true, whitespace: true, message: "Enter room" }]} />
          <Input name="capacity" label="Capacity" type="number" placeholder="Enter student capacity" isRequird rules={[{ required: true, pattern: /^[1-9]\d*$/, message: "Enter a positive whole number" }]} />
          <Select name="academicYear" label="Academic year" placeholder="Select academic year" options={academicYearOptions} isRequird />
          <Select name="status" label="Status" placeholder="Select status" options={classStatusOptions} showSearch={false} isRequird />
        </div>
      </SectionCard>
      <SectionCard title="Class teacher" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select name="teacherId" label="Class teacher" placeholder="Select class teacher" options={teacherOptions} isRequird />
          <Select name="assistantTeacherId" label="Assistant teacher" placeholder="None" options={[{ label: "None", value: "" }, ...teacherOptions]} />
        </div>
      </SectionCard>
      <SectionCard title="Subjects and teachers" className="h-auto!">
        <Form.List name="subjects">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                    <Select name={[field.name, "subject"]} label="Subject" placeholder="Select subject" options={subjectOptions} allowClear />
                    <Select name={[field.name, "teacherId"]} label="Teacher" placeholder="Select teacher" options={teacherOptions} allowClear />
                    <Input name={[field.name, "periodsPerWeek"]} label="Periods per week" type="number" placeholder="Enter periods per week" rules={[{ pattern: /^[1-9]\d*$/, message: "Enter a positive whole number" }]} />
                  </div>
                  <Button variant="text" danger onClick={() => remove(field.name)}>
                    <LuTrash2 aria-hidden="true" />
                    <span className="sr-only">Remove subject row {field.name + 1}</span>
                  </Button>
                </div>
              ))}
              <div><Button variant="secondary" onClick={() => add({})}>Add subject</Button></div>
            </div>
          )}
        </Form.List>
      </SectionCard>
      <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
        <p className="mr-auto text-xs text-gray">Preview changes are kept until the page is refreshed.</p>
        <Button variant="secondary" onClick={() => router.push("/classes")}>Cancel</Button>
        <Button type="submit">{schoolClass ? "Update class" : "Save class"}</Button>
      </div>
    </Form>
  );
}
