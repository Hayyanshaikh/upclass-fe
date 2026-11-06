"use client";

import type { TableColumnsType } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { LuDownload, LuPlus } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import Button from "@/components/ui/Button";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import StudentDetailsDialog from "@/components/dialogs/StudentDetailsDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  StudentDtoStatus,
  StudentsControllerFindAllStatus,
} from "@/app/api/schemas";
import { exportCsv } from "@/utils/export-csv";
import type { Student } from "@/types/student";
import {
  useStudentsControllerFindAll,
  useStudentsControllerRemove,
} from "@/app/api/endpoints";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useTable } from "@/hooks/useTable";
import type {
  FilterField,
  TableAction,
  TableSearch,
} from "@/types/table-toolbar";
import { useRolePermission } from "@/hooks/useRolePermission";

function formatDate(value: string | null) {
  return value ? value.slice(0, 10).split("-").reverse().join("/") : undefined;
}

export default function StudentsPage() {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);
  const { mutateAsync: removeStudent, isPending: isDeleting } =
    useStudentsControllerRemove();

  const { canCreate, canDelete, canEdit, canView, showActions } =
    useRolePermission("students");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setFilters,
    setSearch,
  } = useTable<{
    classId?: string;
    status?: StudentsControllerFindAllStatus;
  }>();

  const { options: classOptions } = useClassDropdown();
  const {
    data: students,
    isFetching,
    error,
    refetch,
  } = useStudentsControllerFindAll({
    limit: pageSize,
    offset,
    searchKey: search,
    classId: filters.classId,
    status: filters.status,
  });

  const total = students?.total ?? 0;
  const studentRecords = students?.data;

  const classNames = useMemo(
    () => new Map(classOptions.map((option) => [option.value, option.label])),
    [classOptions],
  );

  const studentData = useMemo<Student[]>(
    () =>
      (studentRecords ?? []).map((student) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`.trim(),
        roll: student.roll,
        className: classNames.get(student.classId) ?? "—",
        guardian: student.guardian,
        phone: student.phone,
        dateOfBirth: formatDate(student.dateOfBirth),
        gender: student.gender ?? undefined,
        admissionDate: formatDate(student.admissionDate),
        status: student.status,
        relation: student.relation,
        email: student.email ?? undefined,
        address: student.address ?? undefined,
        photo: student.photo ?? undefined,
      })),
    [studentRecords, classNames],
  );

  function downloadCsv() {
    exportCsv("students-page.csv", [
      ["Student", "Roll", "Class", "Guardian", "Phone", "Status"],
      ...studentData.map((student) => [
        student.name,
        student.roll,
        student.className,
        student.guardian,
        student.phone,
        student.status === StudentDtoStatus.ACTIVE ? "Active" : "Inactive",
      ]),
    ]);
  }

  function editStudent(student: Student) {
    flushSync(() => setSelectedStudent(null));
    router.push(`/students/edit/${student.id}`);
  }

  async function confirmDelete() {
    if (!studentToDelete || isDeleting) return;

    const id = studentToDelete.id;
    setDeleteError(null);

    try {
      await removeStudent({ id });
      setStudentToDelete(null);
      if (page > 1 && offset >= total - 1) {
        setPage(page - 1);
      } else {
        void refetch();
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setStudentToDelete(null);
      setDeleteError(message ?? "Unable to delete student. Please try again.");
    }
  }

  let columns: TableColumnsType<Student> = [
    {
      title: "Student",
      key: "student",
      width: 270,
      render: (_, student) => (
        <div>
          <p className="font-bold text-dark">{student.name}</p>
          <p className="text-sm text-gray">Roll {student.roll}</p>
        </div>
      ),
    },
    {
      title: "Class",
      dataIndex: "className",
      key: "class",
      width: 120,
    },
    {
      title: "Guardian",
      dataIndex: "guardian",
      key: "guardian",
      width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <StatusBadge
          variant={status === StudentDtoStatus.ACTIVE ? "success" : "neutral"}
        >
          {status === StudentDtoStatus.ACTIVE ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, student) => (
        <ActionButtons
          name={student.name}
          showView={canView}
          showEdit={canEdit}
          showDelete={canDelete}
          onView={() => setSelectedStudent(student)}
          onEdit={() => editStudent(student)}
          onDelete={() => {
            setDeleteError(null);
            setIsDeleteErrorOpen(false);
            setStudentToDelete(student);
          }}
          deleteDisabled={isDeleting}
        />
      ),
    },
  ];

  if (!showActions) {
    columns = columns.filter((col) => col.key !== "actions");
  }

  const filterFields: FilterField[] = [
    {
      name: "classId",
      label: "Class",
      placeholder: "All classes",
      options: classOptions,
    },
    {
      name: "status",
      label: "Status",
      placeholder: "Any status",
      options: [
        {
          label: "Active",
          value: StudentsControllerFindAllStatus.ACTIVE,
        },
        {
          label: "Inactive",
          value: StudentsControllerFindAllStatus.INACTIVE,
        },
      ],
    },
  ];

  const tableSearch: TableSearch = {
    placeholder: "Search by name, roll, identity or guardian",
    onChange: setSearch,
  };

  const actions: TableAction[] = [
    {
      label: "Export page CSV",
      icon: <LuDownload size={18} aria-hidden="true" />,
      variant: "secondary",
      onClick: downloadCsv,
      showButton: true,
      disabled: studentData.length === 0,
    },
    {
      label: "Add student",
      icon: <LuPlus size={18} aria-hidden="true" />,
      showButton: canCreate,
      onClick: () => router.push("/students/add"),
    },
  ];

  const beforeTable = error ? (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>Unable to load students.</span>
      <Button variant="link" onClick={() => void refetch()}>
        Retry
      </Button>
    </div>
  ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Students" />
      </div>
      <Table
        columns={columns}
        data={studentData}
        rowKey="id"
        total={total}
        loading={isFetching}
        beforeTable={beforeTable}
        pageSize={pageSize}
        current={page}
        search={tableSearch}
        onPageChange={setPage}
        filterValues={filters}
        onFilterValuesChange={setFilters}
        filterFields={filterFields}
        actions={actions}
      />
      <StudentDetailsDialog
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEdit={editStudent}
      />
      <DeleteDialog
        open={studentToDelete !== null}
        title="Delete student?"
        message={`${studentToDelete?.name ?? "This student"} (Roll ${studentToDelete?.roll ?? "—"}) will be permanently removed.`}
        description="This action cannot be undone."
        okText="Delete"
        confirmLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setStudentToDelete(null);
        }}
        onConfirm={() => void confirmDelete()}
        afterClose={() => {
          if (deleteError) setIsDeleteErrorOpen(true);
        }}
      />
      <ErrorDialog
        open={isDeleteErrorOpen}
        title="Unable to remove student"
        message={deleteError ?? "Unable to delete student. Please try again."}
        onClose={() => {
          setIsDeleteErrorOpen(false);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
