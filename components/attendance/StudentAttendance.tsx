"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { TableColumnsType } from "antd";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SegmentedControl from "@/components/ui/SegmentedControl";
import {
  useStudentAttendanceControllerFindAll,
  useStudentAttendanceControllerSaveBulk,
} from "@/app/api/endpoints";
import { attendanceStatusOptions } from "@/constants/attendance";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useClassSectionDropdown } from "@/hooks/useClassSectionDropdown";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTable } from "@/hooks/useTable";
import {
  getStudentAttendanceErrorMessage,
  studentAttendanceRowManipulator,
  studentAttendanceStatusValue,
} from "@/lib/api/student-attendance";
import type { FilterField } from "@/types/table-toolbar";
import type { AttendanceRow, AttendanceStatus } from "@/types/attendance";

// Backend pages the roster at 10 by default; load the whole class so one save covers every student.
const ROSTER_LIMIT = 200;

export default function StudentAttendance() {
  const router = useRouter();
  const { canCreate } = useRolePermission("student_attendance");
  const [form] = Form.useForm();
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { filters, setFilters } = useTable<{
    classId?: string;
    classSectionId?: string;
    date?: Dayjs | null;
  }>({ initialFilters: { date: dayjs() } });

  const { options: classOptions } = useClassDropdown();
  const { options: sectionOptions } = useClassSectionDropdown(filters.classId);

  useEffect(() => {
    if (filters.classId || classOptions.length === 0) return;
    setFilters({ classId: classOptions[0].value });
  }, [classOptions, filters.classId, setFilters]);

  const classId = filters.classId ?? "";
  const date = filters.date ?? null;
  const dateValue = date?.format("YYYY-MM-DD") ?? "";

  const { data, isFetching, error, refetch } =
    useStudentAttendanceControllerFindAll(
      {
        classId,
        classSectionId: filters.classSectionId,
        date: dateValue,
        limit: ROSTER_LIMIT,
      },
      { query: { enabled: Boolean(classId && dateValue) } },
    );

  const rows = studentAttendanceRowManipulator(data?.data);

  useEffect(() => {
    if (!data) return;

    const nextStatuses: Record<string, AttendanceStatus> = {};
    const remarks: Record<string, string> = {};

    for (const row of studentAttendanceRowManipulator(data.data)) {
      nextStatuses[row.id] = row.status;
      remarks[row.id] = row.remarks;
    }

    setStatuses(nextStatuses);
    form.setFieldsValue({ remarks });
  }, [data, form]);

  const { mutateAsync: saveAttendance, isPending: isSaving } =
    useStudentAttendanceControllerSaveBulk();

  async function handleSave() {
    if (!classId || !dateValue || isSaving) return;

    const remarks = (form.getFieldValue("remarks") ?? {}) as Record<
      string,
      string | undefined
    >;

    try {
      const result = await saveAttendance({
        data: {
          classId,
          date: dateValue,
          records: rows.map((row) => ({
            studentId: row.id,
            status: studentAttendanceStatusValue(
              statuses[row.id] ?? row.status,
            ),
            remarks: remarks[row.id] || undefined,
          })),
        },
      });

      setSavedMessage(
        result.message || `${rows.length} students' attendance saved.`,
      );
      void refetch();
    } catch (error) {
      setSaveError(
        getStudentAttendanceErrorMessage(
          error,
          "Unable to save attendance. Please try again.",
        ),
      );
    }
  }

  const columns: TableColumnsType<AttendanceRow> = [
    {
      title: "Roll",
      dataIndex: "roll",
      key: "roll",
      width: 90,
      render: (roll) => <span className="font-bold text-dark">{roll}</span>,
    },
    {
      title: "Student",
      key: "student",
      width: 240,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
          >
            {row.name.charAt(0)}
          </span>
          <span className="font-semibold text-dark">{row.name}</span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 350,
      render: (_, row) => (
        <SegmentedControl
          label={"Attendance for " + row.name}
          value={statuses[row.id] ?? row.status}
          options={attendanceStatusOptions}
          onChange={
            canCreate
              ? (value) =>
                  setStatuses((previous) => ({ ...previous, [row.id]: value }))
              : undefined
          }
        />
      ),
    },
    {
      title: "Remarks",
      key: "remarks",
      width: 260,
      render: (_, row) => (
        <Input
          name={["remarks", row.id]}
          placeholder="Remarks"
          ariaLabel={"Remarks for " + row.name}
        />
      ),
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: "classId",
      label: "Class",
      placeholder: "Select class",
      options: classOptions,
      allowClear: false,
      onChange: () => setFilters({ classSectionId: undefined }),
    },
    {
      name: "classSectionId",
      label: "Section",
      placeholder: "All sections",
      options: sectionOptions,
      allowClear: true,
    },
    {
      type: "date",
      name: "date",
      label: "Date",
      pastOnly: true,
    },
  ];

  const beforeTable = error ? (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>Unable to load student attendance.</span>
      <Button variant="link" onClick={() => void refetch()}>
        Retry
      </Button>
    </div>
  ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Attendance"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/attendance/students/report")}
            >
              View report
            </Button>
            {canCreate && (
              <Button
                loading={isSaving}
                disabled={!classId || !dateValue || rows.length === 0}
                onClick={() => void handleSave()}
              >
                Save attendance
              </Button>
            )}
          </div>
        }
      />
      <Form form={form} component={false}>
        <Table
          columns={columns}
          data={rows}
          loading={isFetching}
          beforeTable={beforeTable}
          rowKey="id"
          pageSize={8}
          showSearch={false}
          filterValues={filters}
          onFilterValuesChange={setFilters}
          filterFields={filterFields}
        />
      </Form>
      <SuccessDialog
        open={savedMessage !== null}
        title="Attendance saved"
        message={savedMessage ?? ""}
        onClose={() => setSavedMessage(null)}
      />
      <ErrorDialog
        open={saveError !== null}
        title="Unable to save attendance"
        message={saveError ?? ""}
        onClose={() => setSaveError(null)}
      />
    </div>
  );
}
