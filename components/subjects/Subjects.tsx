"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import PageHeader from "@/components/shared/PageHeader";
import SubjectDetailsDialog from "@/components/dialogs/SubjectDetailsDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { subjectStatusOptions, subjectTypeOptions } from "@/constants/subjects";
import { useSubjectStore } from "@/stores/subjects";
import { exportCsv } from "@/utils/export-csv";
import type { Subject } from "@/types/subject";

export default function Subjects() {
  const router = useRouter();
  const subjects = useSubjectStore((state) => state.records);
  const deleteSubject = useSubjectStore((state) => state.deleteSubject);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const filteredSubjects = subjects.filter(
    (subject) =>
      `${subject.name} ${subject.code}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()) &&
      (!type || subject.type === type) &&
      (!status || subject.status === status),
  );

  function downloadCsv() {
    exportCsv("subjects.csv", [
      ["Subject", "Code", "Type", "Classes", "Teachers", "Status"],
      ...filteredSubjects.map((subject) => [
        subject.name,
        subject.code,
        subject.type,
        String(subject.classes),
        subject.teachers ? String(subject.teachers) : "Unassigned",
        subject.status,
      ]),
    ]);
  }

  const columns: TableColumnsType<Subject> = [
    {
      title: "Subject",
      dataIndex: "name",
      key: "name",
      width: 190,
      render: (name: string) => (
        <span className="font-bold text-dark">{name}</span>
      ),
    },
    { title: "Code", dataIndex: "code", key: "code", width: 110 },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 130,
      render: (subjectType: Subject["type"]) => (
        <StatusBadge variant={subjectType === "Core" ? "success" : "warning"}>
          {subjectType}
        </StatusBadge>
      ),
    },
    {
      title: "Classes",
      dataIndex: "classes",
      key: "classes",
      width: 140,
      render: (count: number) =>
        `${count} ${count === 1 ? "class" : "classes"}`,
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      key: "teachers",
      width: 150,
      render: (count: number) =>
        count ? (
          `${count} ${count === 1 ? "teacher" : "teachers"}`
        ) : (
          <span className="text-danger">Unassigned</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (subjectStatus: Subject["status"]) => (
        <StatusBadge
          variant={subjectStatus === "Active" ? "success" : "neutral"}
        >
          {subjectStatus}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, subject) => (
        <ActionButtons
          name={subject.name}
          onView={() => setViewingSubject(subject)}
          onEdit={() =>
            router.push(`/subjects/edit/${encodeURIComponent(subject.id)}`)
          }
          onDelete={() => setDeletingSubject(subject)}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Subjects" />
      </div>
      <Table
        columns={columns}
        data={filteredSubjects}
        rowKey="id"
        pageSize={8}
        current={page}
        onPageChange={setPage}
        search={{
          placeholder: "Subject name or code",
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
        }}
        filterFields={[
          {
            name: "type",
            label: "Type",
            placeholder: "Any",
            options: subjectTypeOptions,
            onChange: (value) => {
              setType(value);
              setPage(1);
            },
          },
          {
            name: "status",
            label: "Status",
            placeholder: "Any",
            options: subjectStatusOptions,
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
          },
        ]}
        actions={[
          { label: "Export CSV", variant: "secondary", onClick: downloadCsv },
          { label: "Add subject", onClick: () => router.push("/subjects/add") },
        ]}
        scrollX={1000}
        className="min-h-0"
      />

      <SubjectDetailsDialog
        subject={viewingSubject}
        onClose={() => setViewingSubject(null)}
        onEdit={(subject) => {
          setViewingSubject(null);
          router.push(`/subjects/edit/${encodeURIComponent(subject.id)}`);
        }}
      />
      <DeleteDialog
        open={deletingSubject !== null}
        title="Delete subject?"
        message={
          deletingSubject
            ? `Remove ${deletingSubject.name} from the subject list?`
            : "Remove this subject?"
        }
        onClose={() => setDeletingSubject(null)}
        onConfirm={() => {
          if (deletingSubject) deleteSubject(deletingSubject.id);
          setDeletingSubject(null);
          setPage(1);
        }}
      />
    </div>
  );
}
