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
import ClassDetailsDialog from "@/components/dialogs/ClassDetailsDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  useClassesControllerFindAll,
  useClassesControllerRemove,
} from "@/app/api/endpoints";
import { classStatusFilterOptions } from "@/constants/classes";
import { ROUTE_NAMES } from "@/constants/routes";
import { exportCsv } from "@/utils/export-csv";
import { classManipulator } from "@/lib/api/classes";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTable } from "@/hooks/useTable";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import type {
  ClassFilters,
  ClassRecord,
  ClassesListResponse,
} from "@/types/class-management";
import type {
  FilterField,
  TableAction,
  TableSearch,
} from "@/types/table-toolbar";

export default function ClassesPage() {
  const router = useRouter();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);
  const { mutateAsync: removeClass, isPending: isDeleting } =
    useClassesControllerRemove();

  const { canCreate, canDelete, canEdit, canView, showActions } =
    useRolePermission("classes");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setFilters,
    setSearch,
  } = useTable<ClassFilters>();

  const { options: teacherOptions } = useTeacherDropdown();
  const teacherNames = Object.fromEntries(
    teacherOptions.map((teacher) => [teacher.value, teacher.label]),
  );

  const classParams = {
    limit: pageSize,
    offset,
    searchKey: search,
    teacher: filters.teacher,
    status: filters.status,
  };

  const {
    data: classesResponse,
    isFetching,
    error,
    refetch,
  } = useClassesControllerFindAll<ClassesListResponse>(classParams);

  const total = classesResponse?.total ?? 0;
  const classData = classManipulator(classesResponse?.data, teacherNames);

  function downloadCsv() {
    exportCsv("classes-page.csv", [
      [
        "Class",
        "Section",
        "Class Teacher",
        "Room",
        "Capacity",
        "Academic Year",
        "Status",
      ],
      ...classData.map((record) => [
        record.name,
        record.section,
        record.teacherName,
        record.room,
        String(record.capacity),
        record.academicYear,
        record.status,
      ]),
    ]);
  }

  function editClass(record: ClassRecord) {
    flushSync(() => setSelectedClassId(null));
    router.push(
      ROUTE_NAMES.editClass.replace(":id", encodeURIComponent(record.id)),
    );
  }

  async function confirmDelete() {
    if (!classToDelete || isDeleting) return;

    const id = classToDelete.id;
    setDeleteError(null);

    try {
      await removeClass({ id });
      setClassToDelete(null);
      if (page > 1 && offset >= total - 1) {
        setPage(page - 1);
      } else {
        void refetch();
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setClassToDelete(null);
      setDeleteError(message ?? "Unable to delete class. Please try again.");
    }
  }

  let columns: TableColumnsType<ClassRecord> = [
    {
      title: "Class",
      dataIndex: "name",
      render: (name: string) => (
        <span className="font-bold text-dark">{name}</span>
      ),
    },
    {
      title: "Section",
      dataIndex: "section",
    },
    {
      title: "Class Teacher",
      dataIndex: "teacherName",
      render: (value: string) =>
        value === "Teacher unavailable" ? (
          <span className="text-gray">{value}</span>
        ) : (
          value
        ),
    },
    {
      title: "Room",
      dataIndex: "room",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value: ClassRecord["status"]) => (
        <StatusBadge variant={value === "Active" ? "success" : "danger"}>
          {value}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <ActionButtons
          name={`Class ${record.label}`}
          showView={canView}
          showEdit={canEdit}
          showDelete={canDelete}
          onView={() => setSelectedClassId(record.id)}
          onEdit={() => editClass(record)}
          onDelete={() => {
            setDeleteError(null);
            setIsDeleteErrorOpen(false);
            setClassToDelete(record);
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
      name: "teacher",
      label: "Class Teacher",
      placeholder: "Any teacher",
      options: teacherOptions,
    },
    {
      name: "status",
      label: "Status",
      placeholder: "Any status",
      options: classStatusFilterOptions,
    },
  ];

  const tableSearch: TableSearch = {
    placeholder: "Search by class, section, or teacher",
    onChange: setSearch,
  };

  const actions: TableAction[] = [
    {
      label: "Export page CSV",
      icon: <LuDownload size={18} aria-hidden="true" />,
      variant: "secondary",
      onClick: downloadCsv,
      showButton: true,
      disabled: classData.length === 0,
    },
    {
      label: "Add class",
      icon: <LuPlus size={18} aria-hidden="true" />,
      showButton: canCreate,
      onClick: () => router.push(ROUTE_NAMES.createClass),
    },
  ];

  const beforeTable = error ? (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>Unable to load classes.</span>
      <Button variant="link" onClick={() => void refetch()}>
        Retry
      </Button>
    </div>
  ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Classes" />
      </div>
      <Table
        columns={columns}
        data={classData}
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
      <ClassDetailsDialog
        classId={selectedClassId}
        teacherNames={teacherNames}
        onClose={() => setSelectedClassId(null)}
        onEdit={editClass}
      />
      <DeleteDialog
        open={classToDelete !== null}
        title="Delete class?"
        message={`Delete Class ${classToDelete?.label ?? "this class"}?`}
        description="This permanently removes the class record from this school."
        okText="Yes, delete"
        cancelText="Cancel"
        confirmLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setClassToDelete(null);
        }}
        onConfirm={() => void confirmDelete()}
        afterClose={() => {
          if (deleteError) setIsDeleteErrorOpen(true);
        }}
      />
      <ErrorDialog
        open={isDeleteErrorOpen}
        title="Unable to remove class"
        message={deleteError ?? "Unable to delete class. Please try again."}
        onClose={() => {
          setIsDeleteErrorOpen(false);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
