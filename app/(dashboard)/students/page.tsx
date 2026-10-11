"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import StudentDetailsDialog from "@/components/dialogs/StudentDetailsDialog";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ActionButtons from "@/components/shared/ActionButtons";
import PageHeader from "@/components/shared/PageHeader";
import Table from "@/components/ui/Table";
import { students } from "@/constants/students";
import type { Student } from "@/types/student";

const feeColors = {
  Paid: "bg-[#dceee8] text-primary",
  Pending: "bg-[#fcebc6] text-[#805100]",
  Overdue: "bg-[#f8d9d7] text-danger",
};

export default function StudentsPage() {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [studentRecords, setStudentRecords] = useState(students);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>();
  const [feeFilter, setFeeFilter] = useState<string>();

  function editStudent(student: Student) {
    // Close the dialog before Next.js preserves this page for back navigation.
    flushSync(() => setSelectedStudent(null));
    router.push(`/students/edit/${student.id}`);
  }

  function deleteStudent() {
    if (!studentToDelete) return;
    setStudentRecords((records) =>
      records.filter((student) => student.id !== studentToDelete.id),
    );
    setStudentToDelete(null);
  }

  const filteredStudents = studentRecords.filter((student) => {
    const text =
      `${student.name} ${student.roll} ${student.guardian} ${student.className} ${student.phone}`.toLowerCase();
    return (
      text.includes(search.trim().toLowerCase()) &&
      (!classFilter || student.className === classFilter) &&
      (!feeFilter || student.fees === feeFilter)
    );
  });

  function exportCsv() {
    const rows = [
      ["Student", "Roll", "Class", "Guardian", "Phone", "Fees"],
      ...filteredStudents.map((student) => [
        student.name,
        student.roll,
        student.className,
        student.guardian,
        student.phone,
        student.fees,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const columns: TableColumnsType<Student> = [
    {
      title: "Student",
      key: "student",
      width: 270,
      render: (_, student) => (
        <div className="flex items-center gap-3.5">
          {/* <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dceee8] font-bold text-primary" aria-hidden="true">{student.name.charAt(0)}</span> */}
          <div>
            <p className="font-bold text-dark">{student.name}</p>
            {/* <p className="text-sm text-gray">Roll {student.roll}</p> */}
          </div>
        </div>
      ),
    },
    { title: "Class", dataIndex: "className", key: "class", width: 100 },
    { title: "Guardian", dataIndex: "guardian", key: "guardian", width: 200 },
    { title: "Phone", dataIndex: "phone", key: "phone", width: 220 },
    {
      title: "Fees",
      dataIndex: "fees",
      key: "fees",
      width: 150,
      render: (fees: Student["fees"]) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${feeColors[fees]}`}
        >
          {fees}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, student) => (
        <ActionButtons
          name={student.name}
          onView={() => setSelectedStudent(student)}
          onEdit={() => editStudent(student)}
          onDelete={() => setStudentToDelete(student)}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Students" />
      </div>
      <Table
        columns={columns}
        data={filteredStudents}
        rowKey="id"
        search={{
          placeholder: "Student, roll number or guardian",
          onChange: setSearch,
        }}
        filterFields={[
          {
            name: "class",
            label: "Class",
            placeholder: "All classes",
            options: [...new Set(students.map((student) => student.className))]
              .sort()
              .map((value) => ({ label: value, value })),
            onChange: setClassFilter,
          },
          {
            name: "fees",
            label: "Fee status",
            placeholder: "Any status",
            options: ["Paid", "Pending", "Overdue"].map((value) => ({
              label: value,
              value,
            })),
            onChange: setFeeFilter,
          },
        ]}
        actions={[
          { label: "Export CSV", variant: "secondary", onClick: exportCsv },
          {
            label: "Add student",
            variant: "primary",
            onClick: () => router.push("/students/add"),
          },
        ]}
      />

      <StudentDetailsDialog
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEdit={editStudent}
      />
      <DeleteDialog
        open={studentToDelete !== null}
        title="Delete student?"
        message={`${studentToDelete?.name ?? ""} (Roll ${studentToDelete?.roll ?? ""}) will be removed from the student list.`}
        okText="Delete"
        onClose={() => setStudentToDelete(null)}
        onConfirm={deleteStudent}
      />
    </div>
  );
}
