"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import { LuEye, LuTrash2 } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  employeeLeaveRequests,
  leaveBalances,
} from "@/constants/employee-leaves";
import type { EmployeeLeaveRequest } from "@/types/employee-leave";
import StatCard from "@/components/ui/StatCard";

const statusVariants = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
} as const;
export default function TeacherLeaves() {
  const router = useRouter();
  const [requests, setRequests] = useState(employeeLeaveRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<EmployeeLeaveRequest | null>(null);
  const [cancelRequest, setCancelRequest] =
    useState<EmployeeLeaveRequest | null>(null);

  const columns: TableColumnsType<EmployeeLeaveRequest> = [
    { title: "Type", dataIndex: "leaveType", key: "leaveType", width: 170 },
    { title: "Dates", dataIndex: "dates", key: "dates", width: 220 },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
      width: 90,
      render: (days: number) => `${days} ${days === 1 ? "day" : "days"}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: EmployeeLeaveRequest["status"]) => (
        <StatusBadge variant={statusVariants[status]}>{status}</StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      render: (_, request) => (
        <ActionButtons
          actions={[
            {
              label: "View leave request",
              icon: LuEye,
              onClick: () => setSelectedRequest(request),
            },
            {
              label: "Cancel leave request",
              icon: LuTrash2,
              danger: request.status === "Pending",
              disabled: request.status !== "Pending",
              onClick: () => setCancelRequest(request),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader
        title="Teacher leaves"
        subtitle="Your leave balance and requests"
        actions={
          <Button onClick={() => router.push("/teacher-leaves/apply")}>
            Apply leave
          </Button>
        }
      />

      <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
        {leaveBalances.map((balance) => (
          <StatCard
            key={balance.type}
            size="sm"
            title={balance.type}
            description={`${balance.used} ${balance.used > 1 ? "days" : "day"} used`}
            value={`${balance.remaining} out of ${balance.total}`}
          />
        ))}
      </div>

      <Table
        columns={columns}
        data={requests}
        rowKey="id"
        current={1}
        pageSize={5}
        header={
          <h2 className="text-base font-extrabold text-dark">My requests</h2>
        }
        showSearch={false}
        interactive={false}
        scrollX={680}
      />

      <Dialog
        open={Boolean(selectedRequest)}
        title="Leave request details"
        okText="Close"
        cancelText="Close"
        onClose={() => setSelectedRequest(null)}
        onConfirm={() => setSelectedRequest(null)}
      >
        {selectedRequest && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray">Type</dt>
              <dd className="mt-1 font-semibold text-dark">
                {selectedRequest.leaveType}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Status</dt>
              <dd className="mt-1">
                <StatusBadge variant={statusVariants[selectedRequest.status]}>
                  {selectedRequest.status}
                </StatusBadge>
              </dd>
            </div>
            <div>
              <dt className="text-gray">Dates</dt>
              <dd className="mt-1 font-semibold text-dark">
                {selectedRequest.dates}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Duration</dt>
              <dd className="mt-1 font-semibold text-dark">
                {selectedRequest.days}{" "}
                {selectedRequest.days === 1 ? "day" : "days"}
              </dd>
            </div>
          </dl>
        )}
      </Dialog>

      <Dialog
        open={Boolean(cancelRequest)}
        title="Cancel leave request?"
        okText="Cancel request"
        confirmDanger
        onClose={() => setCancelRequest(null)}
        onConfirm={() => {
          if (cancelRequest)
            setRequests((current) =>
              current.filter((request) => request.id !== cancelRequest.id),
            );
          setCancelRequest(null);
        }}
      >
        <p className="text-sm leading-relaxed text-gray">
          {cancelRequest
            ? `Your ${cancelRequest.leaveType.toLowerCase()} request for ${cancelRequest.dates} will be removed.`
            : ""}
        </p>
      </Dialog>
    </div>
  );
}
