"use client";

import type { TableColumnsType } from "antd";
import { LuEye, LuFileText, LuPencil, LuTrash2 } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import ActionButtons from "@/components/shared/ActionButtons";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { examFilterFields, exams, examStatusVariants, examToolbarActions } from "@/constants/exams";
import type { Exam } from "@/types/exam";

export default function Exams() {
  const columns: TableColumnsType<Exam> = [
    { title: "Exam", dataIndex: "name", key: "name", width: 220,
      render: (name) => <span className="font-bold text-dark">{name}</span> },
    { title: "Classes", dataIndex: "classes", key: "classes", width: 160 },
    { title: "Dates", dataIndex: "dates", key: "dates", width: 230 },
    { title: "Subjects", dataIndex: "subjects", key: "subjects", width: 100 },
    { title: "Status", key: "status", width: 170,
      render: (_, exam) => <StatusBadge variant={examStatusVariants[exam.status]}>{exam.status}</StatusBadge> },
    { title: "Actions", key: "actions", width: 160,
      render: (_, exam) => <ActionButtons actions={[
        { label: "View " + exam.name, icon: LuEye },
        { label: "Results for " + exam.name, icon: LuFileText },
        { label: "Edit " + exam.name, icon: LuPencil },
        { label: "Delete " + exam.name, icon: LuTrash2, danger: true },
      ]} /> },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0"><PageHeader title="Exams & Results" /></div>
      <Table columns={columns} data={exams} pageSize={6} current={1} total={12} interactive={false}
        search={{ placeholder: "Exam name" }} filterFields={examFilterFields} actions={examToolbarActions} />
    </div>
  );
}
