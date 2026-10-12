"use client";

import { useRef, useState } from "react";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/shared/PageHeader";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import TeacherDetailsDialog from "@/components/dialogs/TeacherDetailsDialog";
import TeacherFormDialog from "@/components/dialogs/TeacherFormDialog";
import {
  teachers,
  teacherEmploymentOptions,
  teacherStatusOptions,
  teacherStatusVariants,
} from "@/constants/teachers";
import { exportCsv } from "@/utils/export-csv";
import type { Teacher, TeacherFormValues } from "@/types/teacher";

export default function TeachersPage() {
  const [records, setRecords] = useState(teachers);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<string>();
  const [employment, setEmployment] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const nextId = useRef(
    Math.max(...teachers.map((teacher) => Number(teacher.id.slice(2)))) + 1,
  );

  const filteredTeachers = records.filter(
    (teacher) =>
      `${teacher.name} ${teacher.id} ${teacher.subject}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()) &&
      (!subject || teacher.subject === subject) &&
      (!employment || teacher.employment === employment) &&
      (!status || teacher.status === status),
  );

  function editTeacher(teacher: Teacher) {
    setSelectedTeacher(null);
    setEditingTeacher(teacher);
    setFormOpen(true);
  }

  function saveTeacher(values: TeacherFormValues) {
    const teacher: Teacher = {
      ...values,
      id:
        editingTeacher?.id ?? `T-${String(nextId.current++).padStart(3, "0")}`,
      name: values.name.trim(),
      phone: values.phone.trim(),
      classes: [
        ...new Set(values.classes.split(",").map((value) => value.trim())),
      ],
    };
    setRecords((current) =>
      editingTeacher
        ? current.map((record) =>
            record.id === editingTeacher.id ? teacher : record,
          )
        : [teacher, ...current],
    );
    setPage(1);
    setFormOpen(false);
  }

  function downloadCsv() {
    exportCsv("teachers.csv", [
      ["ID", "Teacher", "Subject", "Classes", "Phone", "Employment", "Status"],
      ...filteredTeachers.map((teacher) => [
        teacher.id,
        teacher.name,
        teacher.subject,
        teacher.classes.join(", "),
        teacher.phone,
        teacher.employment,
        teacher.status,
      ]),
    ]);
  }

  const columns: TableColumnsType<Teacher> = [
    {
      title: "Teacher",
      key: "teacher",
      width: 240,
      render: (_, teacher) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
          >
            {teacher.name.charAt(0)}
          </span>
          <div>
            <p className="font-bold text-dark">{teacher.name}</p>
            <p className="text-xs text-gray">ID {teacher.id}</p>
          </div>
        </div>
      ),
    },
    { title: "Subject", dataIndex: "subject", key: "subject", width: 150 },
    {
      title: "Classes",
      key: "classes",
      width: 120,
      render: (_, teacher) => teacher.classes.join(", "),
    },
    { title: "Phone", dataIndex: "phone", key: "phone", width: 180 },
    {
      title: "Status",
      key: "status",
      width: 130,
      render: (_, teacher) => (
        <StatusBadge variant={teacherStatusVariants[teacher.status]}>
          {teacher.status}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, teacher) => (
        <ActionButtons
          name={teacher.name}
          onView={() => setSelectedTeacher(teacher)}
          onEdit={() => editTeacher(teacher)}
          onDelete={() => setTeacherToDelete(teacher)}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <PageHeader title="Teachers" />
      </div>
      <Table
        columns={columns}
        data={filteredTeachers}
        pageSize={6}
        current={page}
        onPageChange={setPage}
        search={{ placeholder: "Name, ID or subject", onChange: setSearch }}
        filterFields={[
          {
            name: "subject",
            label: "Subject",
            placeholder: "All subjects",
            options: [...new Set(records.map((teacher) => teacher.subject))]
              .sort()
              .map((value) => ({ label: value, value })),
            onChange: setSubject,
          },
          {
            name: "employment",
            label: "Employment",
            placeholder: "Any employment",
            options: teacherEmploymentOptions,
            onChange: setEmployment,
          },
          {
            name: "status",
            label: "Status",
            placeholder: "Any status",
            options: teacherStatusOptions,
            onChange: setStatus,
          },
        ]}
        actions={[
          { label: "Export CSV", variant: "secondary", onClick: downloadCsv },
          {
            label: "Add teacher",
            onClick: () => {
              setEditingTeacher(null);
              setFormOpen(true);
            },
          },
        ]}
      />
      <TeacherDetailsDialog
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        onEdit={editTeacher}
      />
      <TeacherFormDialog
        open={formOpen}
        teacher={editingTeacher}
        onClose={() => setFormOpen(false)}
        onSave={saveTeacher}
      />
      <DeleteDialog
        open={teacherToDelete !== null}
        title="Delete teacher?"
        message={`Remove ${teacherToDelete?.name ?? "this teacher"} from the teachers list?`}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={() => {
          setRecords((current) =>
            current.filter((teacher) => teacher.id !== teacherToDelete?.id),
          );
          setTeacherToDelete(null);
        }}
      />
    </div>
  );
}
