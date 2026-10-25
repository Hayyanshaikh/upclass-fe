"use client";

import type { TableColumnsType } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { flushSync } from "react-dom";
import { LuDownload, LuPlus } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import Button from "@/components/ui/Button";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import TeacherDetailsDialog from "@/components/dialogs/TeacherDetailsDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  TeachersControllerFindAllEmploymentType,
  TeachersControllerFindAllStatus,
} from "@/app/api/schemas";
import { teacherSubjects } from "@/constants/teachers";
import { exportCsv } from "@/utils/export-csv";
import type { TeacherAccount, TeacherStatus } from "@/types/teacher-management";
import {
  useTeachersControllerFindAll,
  useTeachersControllerRemove,
} from "@/app/api/endpoints";
import { teacherManipulator } from "@/lib/api/teachers";
import { useTable } from "@/hooks/useTable";
import type {
  FilterField,
  TableAction,
  TableSearch,
} from "@/types/table-toolbar";
import { useRolePermission } from "@/hooks/useRolePermission";

export default function TeachersPage() {
  const router = useRouter();
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAccount | null>(
    null,
  );
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherAccount | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);
  const { mutateAsync: removeTeacher, isPending: isDeleting } =
    useTeachersControllerRemove();

  const { canCreate, canDelete, canEdit, canView, showActions } =
    useRolePermission("teachers");

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
    subject?: string;
    employmentType?: TeachersControllerFindAllEmploymentType;
    status?: TeachersControllerFindAllStatus;
  }>();

  const {
    data: teachers,
    isFetching,
    error,
    refetch,
  } = useTeachersControllerFindAll({
    limit: pageSize,
    offset,
    searchKey: search,
    employmentType: filters.employmentType,
    status: filters.status,
    // subject: filters.subject, // Enable when the Subject API and Teacher query support it.
  });

  const total = teachers?.total ?? 0;
  const teacherData = teacherManipulator(teachers?.data);

  function downloadCsv() {
    exportCsv("teachers-page.csv", [
      [
        "Teacher",
        "Employee ID",
        "Email",
        "Phone",
        "Employment Type",
        "Status",
      ],
      ...teacherData.map((teacher) => [
        teacher.name,
        teacher.employeeId,
        teacher.email,
        teacher.phone,
        teacher.employmentType,
        teacher.isActive,
      ]),
    ]);
  }

  function editTeacher(teacher: TeacherAccount) {
    flushSync(() => setSelectedTeacher(null));
    router.push(`/teachers/edit/${encodeURIComponent(teacher.id)}`);
  }

  async function confirmDelete() {
    if (!teacherToDelete || teacherToDelete.isSystem || isDeleting) return;

    const id = teacherToDelete.id;
    setDeleteError(null);

    try {
      await removeTeacher({ id });
      setTeacherToDelete(null);
      if (page > 1 && offset >= total - 1) {
        setPage(page - 1);
      } else {
        void refetch();
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setTeacherToDelete(null);
      setDeleteError(message ?? "Unable to delete teacher. Please try again.");
    }
  }

  let columns: TableColumnsType<TeacherAccount> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string) => (
        <span className="font-bold text-dark">{name}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email: string) =>
        email === "—" ? <span className="text-gray">—</span> : email,
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      render: (value: string) =>
        value === "—" ? <span className="text-gray">—</span> : value,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (value: TeacherStatus) => (
        <StatusBadge variant={value === "Active" ? "success" : "neutral"}>
          {value}
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
          showView={canView}
          showEdit={canEdit}
          showDelete={canDelete}
          onView={() => setSelectedTeacher(teacher)}
          onEdit={() => editTeacher(teacher)}
          onDelete={() => {
            if (teacher.isSystem) return;
            setDeleteError(null);
            setIsDeleteErrorOpen(false);
            setTeacherToDelete(teacher);
          }}
          deleteDisabled={teacher.isSystem || isDeleting}
          deleteDisabledReason={
            teacher.isSystem ? "System teachers cannot be deleted" : undefined
          }
        />
      ),
    },
  ];

  if (!showActions) {
    columns = columns?.filter((col) => col.key !== "actions");
  }

  const filterFields: FilterField[] = [
    {
      name: "subject",
      label: "Subject",
      placeholder: "All subjects",
      options: teacherSubjects.map((value) => ({ label: value, value })),
    },
    {
      name: "employmentType",
      label: "Employment Type",
      placeholder: "Any employment",
      options: Object.values(TeachersControllerFindAllEmploymentType).map(
        (value) => ({
          label: value
            .replaceAll("_", "-")
            .toLowerCase()
            .replace(/^./, (letter) => letter.toUpperCase()),
          value,
        }),
      ),
    },
    {
      name: "status",
      label: "Status",
      placeholder: "Any status",
      options: [
        { label: "Active", value: TeachersControllerFindAllStatus.ACTIVE },
        { label: "Inactive", value: TeachersControllerFindAllStatus.INACTIVE },
      ],
    },
  ];

  const tableSearch: TableSearch = {
    placeholder: "Search by name or employee ID",
    onChange: setSearch,
  };

  const actions: TableAction[] = [
    {
      label: "Export page CSV",
      icon: <LuDownload size={18} aria-hidden="true" />,
      variant: "secondary",
      onClick: downloadCsv,
      showButton: true,
      disabled: teacherData.length === 0,
    },
    {
      label: "Add teacher",
      icon: <LuPlus size={18} aria-hidden="true" />,
      showButton: canCreate,
      onClick: () => router.push("/teachers/add"),
    },
  ];

  const beforeTable =
    error ? (
      <div
        role="alert"
        className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
      >
        <span>
          Unable to load teachers.
        </span>
        <Button variant="link" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Teachers" />
      </div>
      <Table
        columns={columns}
        data={teacherData}
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
      <TeacherDetailsDialog
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        onEdit={editTeacher}
      />
      <DeleteDialog
        open={teacherToDelete !== null}
        title="Delete teacher and linked user?"
        message={`Delete ${teacherToDelete?.name ?? "this teacher"} and their linked user account?`}
        description="No keeps both records. Yes permanently deletes both only when the user has no other linked records."
        okText="Yes, delete both"
        cancelText="No, keep both"
        confirmLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setTeacherToDelete(null);
        }}
        onConfirm={() => void confirmDelete()}
        afterClose={() => {
          if (deleteError) setIsDeleteErrorOpen(true);
        }}
      />
      <ErrorDialog
        open={isDeleteErrorOpen}
        title="Unable to remove teacher"
        message={deleteError ?? "Unable to delete teacher. Please try again."}
        onClose={() => {
          setIsDeleteErrorOpen(false);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
