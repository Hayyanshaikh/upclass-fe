"use client";

import { Form } from "antd";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/shared/PageHeader";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SegmentedControl from "@/components/ui/SegmentedControl";
import {
  attendanceFilterFields,
  attendanceRows,
  attendanceStatusOptions,
} from "@/constants/attendance";
import type { AttendanceRow } from "@/types/attendance";

export default function StudentAttendance() {
  const router = useRouter();
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
          value={row.status}
          options={attendanceStatusOptions}
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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
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
            <Button>Save attendance</Button>
          </div>
        }
      />
      <Form
        component={false}
        initialValues={{
          remarks: Object.fromEntries(
            attendanceRows.map((row) => [row.id, row.remarks]),
          ),
        }}
      >
        <Table
          columns={columns}
          data={attendanceRows}
          total={38}
          current={1}
          pageSize={8}
          interactive={false}
          showSearch={false}
          filterFields={attendanceFilterFields}
        />
      </Form>
    </div>
  );
}
