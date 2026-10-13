"use client";

import { useState } from "react";
import type { TableColumnsType } from "antd";
import { LuCheck, LuEye, LuX } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import ReviewLeaveRequestDialog from "@/components/dialogs/ReviewLeaveRequestDialog";
import RejectLeaveRequestDialog from "@/components/dialogs/RejectLeaveRequestDialog";
import CancelLeaveRequestDialog from "@/components/dialogs/CancelLeaveRequestDialog";
import { leaveRequestFilterFields, leaveRequests as initialLeaveRequests, leaveRequestsTotal } from "@/constants/leave-requests";
import type { LeaveRequest } from "@/types/leave-request";

const statusVariants = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
  Cancelled: "neutral",
} as const;

export default function LeaveRequests() {
  const [requests, setRequests] = useState(initialLeaveRequests);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  function openReview(request: LeaveRequest) {
    setSelectedRequest(request);
    setReviewOpen(true);
  }

  function updateStatus(status: LeaveRequest["status"], rejectionReason?: string) {
    if (!selectedRequest) return;
    setRequests((current) => current.map((request) =>
      request.id === selectedRequest.id ? { ...request, status, rejectionReason } : request,
    ));
    setSelectedRequest((request) => request ? { ...request, status, rejectionReason } : request);
    setReviewOpen(false);
    setRejectOpen(false);
    setCancelOpen(false);
  }

  function finishDialogClose() {
    if (!reviewOpen && !rejectOpen && !cancelOpen) setSelectedRequest(null);
  }

  const columns: TableColumnsType<LeaveRequest> = [
    {
      title: "Teacher",
      key: "teacher",
      width: 250,
      render: (_, request) => (
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary" aria-hidden="true">
            {request.teacherName.charAt(0)}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="font-bold text-dark">{request.teacherName}</span>
            <span className="text-sm text-gray">{request.teacherId}</span>
          </span>
        </div>
      ),
    },
    { title: "Type", dataIndex: "leaveType", key: "leaveType", width: 170 },
    { title: "Dates", dataIndex: "dates", key: "dates", width: 230 },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
      width: 100,
      render: (days: number) => `${days} ${days === 1 ? "day" : "days"}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: LeaveRequest["status"]) => (
        <StatusBadge variant={statusVariants[status]}>{status}</StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, request) => {
        const isPending = request.status === "Pending";
        return (
          <ActionButtons
            actions={[
              { label: `Review ${request.teacherName}'s leave request`, icon: LuEye, onClick: () => openReview(request) },
              { label: "Review and approve leave request", icon: LuCheck, success: true, disabled: !isPending, onClick: () => openReview(request) },
              {
                label: "Reject leave request",
                icon: LuX,
                danger: true,
                disabled: !isPending,
                onClick: () => { setSelectedRequest(request); setRejectOpen(true); },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <PageHeader title="Leave requests" />
      </div>
      <Table
        columns={columns}
        data={requests}
        rowKey="id"
        current={1}
        total={leaveRequestsTotal}
        pageSize={10}
        interactive={false}
        search={{ label: "Search", placeholder: "Teacher name or ID" }}
        filterFields={leaveRequestFilterFields}
        actions={[{ label: "Export CSV", variant: "secondary" }]}
      />

      {selectedRequest && <>
        <ReviewLeaveRequestDialog
          request={selectedRequest}
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          onApprove={() => updateStatus("Approved")}
          onReject={() => { setReviewOpen(false); setRejectOpen(true); }}
          onCancelRequest={() => { setReviewOpen(false); setCancelOpen(true); }}
          afterClose={finishDialogClose}
        />
        <RejectLeaveRequestDialog
          request={selectedRequest}
          open={rejectOpen}
          onClose={() => setRejectOpen(false)}
          onReject={(reason) => updateStatus("Rejected", reason)}
          afterClose={finishDialogClose}
        />
        <CancelLeaveRequestDialog
          request={selectedRequest}
          open={cancelOpen}
          onClose={() => setCancelOpen(false)}
          onConfirm={() => updateStatus("Cancelled")}
          afterClose={finishDialogClose}
        />
      </>}
    </div>
  );
}
