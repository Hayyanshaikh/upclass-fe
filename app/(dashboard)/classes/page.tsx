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
import ClassDetailsDialog from "@/components/dialogs/ClassDetailsDialog";
import { classGradeOptions, classStatusOptions } from "@/constants/classes";
import { useClassStore } from "@/stores/classes";
import { useTeacherStore } from "@/stores/teachers";
import { exportCsv } from "@/utils/export-csv";
import type { SchoolClass } from "@/types/classes";

export default function ClassesPage() {
  const router = useRouter();
  const records = useClassStore((state) => state.records);
  const deleteClass = useClassStore((state) => state.deleteClass);
  const teachers = useTeacherStore((state) => state.records);
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState<string>();
  const [teacherId, setTeacherId] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);
  const teacherName = (id: string) => teachers.find((teacher) => teacher.id === id)?.name ?? "Teacher unavailable";

  const filteredClasses = records.filter((record) =>
    `Class ${record.grade} ${record.grade}-${record.section} ${record.section} ${teacherName(record.teacherId)}`.toLowerCase().includes(search.trim().toLowerCase()) &&
    (!grade || record.grade === grade) &&
    (!teacherId || record.teacherId === teacherId) &&
    (!status || record.status === status),
  );

  function editClass(record: SchoolClass) {
    flushSync(() => setSelectedClass(null));
    router.push(`/classes/edit/${encodeURIComponent(record.id)}`);
  }

  function downloadCsv() {
    exportCsv("classes.csv", [
      ["Class", "Section", "Class teacher", "Students", "Room", "Capacity", "Academic year", "Status"],
      ...filteredClasses.map((record) => [`Class ${record.grade}`, record.section, teacherName(record.teacherId), String(record.students), record.room, String(record.capacity), record.academicYear, record.status]),
    ]);
  }

  const columns: TableColumnsType<SchoolClass> = [
    { title: "Class", key: "grade", width: 130, render: (_, record) => <span className="font-bold text-dark">Class {record.grade}</span> },
    { title: "Section", dataIndex: "section", key: "section", width: 110 },
    { title: "Class teacher", key: "teacher", width: 200, render: (_, record) => teacherName(record.teacherId) },
    { title: "Students", dataIndex: "students", key: "students", width: 120 },
    { title: "Room", dataIndex: "room", key: "room", width: 140 },
    { title: "Status", key: "status", width: 140, render: (_, record) => <StatusBadge variant={record.status === "Active" ? "success" : "neutral"}>{record.status}</StatusBadge> },
    {
      title: "Actions", key: "actions", width: 160,
      render: (_, record) => <ActionButtons name={`Class ${record.grade}-${record.section}`} onView={() => setSelectedClass(record)} onEdit={() => editClass(record)} onDelete={() => setClassToDelete(record)} />,
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0"><PageHeader title="Classes" /></div>
      <Table
        columns={columns}
        data={filteredClasses}
        pageSize={6}
        current={page}
        onPageChange={setPage}
        search={{ placeholder: "Class or teacher", onChange: setSearch }}
        filterFields={[
          { name: "grade", label: "Grade", placeholder: "All grades", options: classGradeOptions, onChange: setGrade },
          { name: "teacher", label: "Class teacher", placeholder: "Any teacher", options: teachers.map((teacher) => ({ label: teacher.name, value: teacher.id })), onChange: setTeacherId },
          { name: "status", label: "Status", placeholder: "Any status", options: classStatusOptions, onChange: setStatus },
        ]}
        actions={[
          { label: "Export CSV", variant: "secondary", onClick: downloadCsv },
          { label: "Add class", onClick: () => router.push("/classes/add") },
        ]}
      />
      <ClassDetailsDialog schoolClass={selectedClass} onClose={() => setSelectedClass(null)} onEdit={editClass} />
      <DeleteDialog
        open={classToDelete !== null}
        title="Delete class?"
        message={classToDelete ? `Remove Class ${classToDelete.grade}-${classToDelete.section} from the class list?` : "Remove this class?"}
        description="This changes the current preview only. Student records remain available."
        onClose={() => setClassToDelete(null)}
        onConfirm={() => { if (classToDelete) deleteClass(classToDelete.id); setClassToDelete(null); }}
      />
    </div>
  );
}
