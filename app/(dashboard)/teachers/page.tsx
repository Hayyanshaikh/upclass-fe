"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/shared/PageHeader";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import TeacherDetailsDialog from "@/components/dialogs/TeacherDetailsDialog";
import {
  teacherEmploymentOptions,
  teacherStatusOptions,
  teacherStatusVariants,
} from "@/constants/teachers";
import { exportCsv } from "@/utils/export-csv";
import type { Teacher } from "@/types/teacher";
import { useTeacherStore } from "@/stores/teachers";

export default function TeachersPage() {
  const router = useRouter();
  const records = useTeacherStore((state) => state.records);
  const deleteTeacher = useTeacherStore((state) => state.deleteTeacher);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<string>();
  const [employment, setEmployment] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

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
    flushSync(() => setSelectedTeacher(null));
    router.push(`/teachers/edit/${encodeURIComponent(teacher.id)}`);
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
    <div className="flex h-full min-h-0 flex-col">
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
            onClick: () => router.push("/teachers/add"),
          },
        ]}
      />
      <TeacherDetailsDialog
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        onEdit={editTeacher}
      />
      <DeleteDialog
        open={teacherToDelete !== null}
        title="Delete teacher?"
        message={`Remove ${teacherToDelete?.name ?? "this teacher"} from the teachers list?`}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={() => {
          if (teacherToDelete) deleteTeacher(teacherToDelete.id);
          setTeacherToDelete(null);
        }}
      />
    </div>
  );
}
