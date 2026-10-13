"use client";

import type { TableColumnsType } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuEye, LuFileText, LuPencil, LuTrash2 } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import ActionButtons from "@/components/shared/ActionButtons";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import ExamDetailsDialog from "@/components/dialogs/ExamDetailsDialog";
import {
  examFilterFields,
  exams,
  examStatusVariants,
  examToolbarActions,
} from "@/constants/exams";
import type { Exam } from "@/types/exam";

export default function Exams() {
  const router = useRouter();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editAfterClose, setEditAfterClose] = useState(false);

  function viewExam(exam: Exam) {
    setSelectedExam(exam);
    setEditAfterClose(false);
    setDetailsOpen(true);
  }

  function finishClosingDetails() {
    if (editAfterClose && selectedExam)
      router.push(`/exams/edit/${selectedExam.id}`);
    setSelectedExam(null);
    setEditAfterClose(false);
  }
  const columns: TableColumnsType<Exam> = [
    {
      title: "Exam",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (name) => <span className="font-bold text-dark">{name}</span>,
    },
    { title: "Classes", dataIndex: "classes", key: "classes", width: 160 },
    { title: "Dates", dataIndex: "dates", key: "dates", width: 230 },
    { title: "Subjects", dataIndex: "subjects", key: "subjects", width: 100 },
    {
      title: "Status",
      key: "status",
      width: 170,
      render: (_, exam) => (
        <StatusBadge variant={examStatusVariants[exam.status]}>
          {exam.status}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, exam) => (
        <ActionButtons
          actions={[
            {
              label: "View ",
              icon: LuEye,
              onClick: () => viewExam(exam),
            },
            { label: "Enter marks", icon: LuFileText, onClick: () => router.push(`/exams/marks?exam=${exam.id}`) },
            {
              label: "Edit ",
              icon: LuPencil,
              onClick: () => router.push(`/exams/edit/${exam.id}`),
            },
            { label: "Delete ", icon: LuTrash2, danger: true },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <PageHeader title="Exams & Results" />
      </div>
      <Table
        columns={columns}
        data={exams}
        pageSize={6}
        current={1}
        total={12}
        interactive={false}
        search={{ placeholder: "Exam name" }}
        filterFields={examFilterFields}
        actions={examToolbarActions.map((action) =>
          action.label === "Create exam"
            ? { ...action, onClick: () => router.push("/exams/create") }
            : action,
        )}
      />
      {selectedExam && (
        <ExamDetailsDialog
          exam={selectedExam}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          afterClose={finishClosingDetails}
          onEdit={() => {
            setEditAfterClose(true);
            setDetailsOpen(false);
          }}
        />
      )}
    </div>
  );
}
