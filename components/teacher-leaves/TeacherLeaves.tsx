"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { LuEye, LuTrash2 } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  useLeaveRequestsControllerCancelMy,
  useLeaveRequestsControllerMyBalance,
  useLeaveRequestsControllerMyRequests,
} from "@/app/api/endpoints";
import { LeaveRequestDtoStatus } from "@/app/api/schemas";
import type { LeaveRequestDto } from "@/app/api/schemas";
import { DISPLAY_DATE } from "@/constants/date-formats";
import { useRolePermission } from "@/hooks/useRolePermission";
import {
  formatLeaveRequestDates,
  formatTeacherName,
  getLeaveRequestErrorMessage,
  leaveRequestDaysLabel,
  leaveRequestStatusLabels,
  leaveRequestStatusVariants,
} from "@/lib/api/leave-requests";

export default function TeacherLeaves() {
  const router = useRouter();
  const { canCreate, canEdit } = useRolePermission("teacher_leaves");
  const [selected, setSelected] = useState<LeaveRequestDto | null>(null);
  const [cancelTarget, setCancelTarget] = useState<LeaveRequestDto | null>(
    null,
  );
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const {
    data: balanceData,
    isFetching: isBalanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useLeaveRequestsControllerMyBalance();
  const balanceRows = balanceData?.data ?? [];

  const { data, isFetching, error, refetch } =
    useLeaveRequestsControllerMyRequests();

  const { mutateAsync: cancelMy, isPending: isCancelling } =
    useLeaveRequestsControllerCancelMy();

  async function confirmCancel() {
    if (!cancelTarget || isCancelling) return;

    const label = `${cancelTarget.leavePolicy?.name ?? "Leave"} · ${formatLeaveRequestDates(
      cancelTarget.fromDate,
      cancelTarget.toDate,
    )}`;

    try {
      await cancelMy({ id: cancelTarget.id });
      await refetch();
      setCancelTarget(null);
      setCancelSuccess(`Your leave request (${label}) was cancelled.`);
    } catch (error) {
      setCancelTarget(null);
      setCancelError(
        getLeaveRequestErrorMessage(
          error,
          "Unable to cancel this leave request.",
        ),
      );
    }
  }

  const columns: TableColumnsType<LeaveRequestDto> = [
    {
      title: "Type",
      key: "type",
      width: 170,
      render: (_, request) => request.leavePolicy?.name ?? "—",
    },
    {
      title: "Dates",
      key: "dates",
      width: 220,
      render: (_, request) =>
        formatLeaveRequestDates(request.fromDate, request.toDate),
    },
    {
      title: "Days",
      key: "days",
      width: 110,
      render: (_, request) =>
        request.isHalfDay
          ? "Half day"
          : leaveRequestDaysLabel(request.totalDays),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, request) => (
        <StatusBadge variant={leaveRequestStatusVariants[request.status]}>
          {leaveRequestStatusLabels[request.status]}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: canEdit ? 100 : 60,
      render: (_, request) => {
        const pending = request.status === LeaveRequestDtoStatus.PENDING;

        return (
          <ActionButtons
            actions={[
              {
                label: "View leave request",
                icon: LuEye,
                onClick: () => setSelected(request),
              },
              ...(canEdit
                ? [
                    {
                      label: pending
                        ? "Cancel leave request"
                        : "Only pending requests can be cancelled",
                      icon: LuTrash2,
                      danger: true,
                      disabled: !pending,
                      onClick: () => setCancelTarget(request),
                    },
                  ]
                : []),
            ]}
          />
        );
      },
    },
  ];

  const beforeTable = error ? (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>Unable to load your leave requests.</span>
      <Button variant="link" onClick={() => void refetch()}>
        Retry
      </Button>
    </div>
  ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Teacher leaves"
        actions={
          canCreate ? (
            <Button onClick={() => router.push("/teacher-leaves/apply")}>
              Apply leave
            </Button>
          ) : undefined
        }
      />

      {balanceError ? (
        <div
          role="alert"
          className="mb-4 flex shrink-0 items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <span>Unable to load your leave balance.</span>
          <Button variant="link" onClick={() => void refetchBalance()}>
            Retry
          </Button>
        </div>
      ) : isBalanceLoading || balanceRows.length > 0 ? (
        <div className="mb-4 grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-4">
          {isBalanceLoading
            ? [0, 1, 2].map((index) => (
                <SectionCard key={index} size="sm">
                  <div className="h-9" />
                </SectionCard>
              ))
            : balanceRows.map((balance) => (
                <StatCard
                  key={balance.leavePolicyId}
                  size="sm"
                  title={balance.leaveType}
                  description={`${leaveRequestDaysLabel(balance.usedDays)} used or pending`}
                  value={`${balance.remainingDays} of ${balance.daysPerYear}`}
                />
              ))}
        </div>
      ) : (
        <div className="mb-4 shrink-0">
          <SectionCard size="sm">
            <p className="text-sm text-gray">
              No leave policy is configured for your school yet.
            </p>
          </SectionCard>
        </div>
      )}

      <Table
        columns={columns}
        data={data?.data ?? []}
        rowKey="id"
        pageSize={5}
        loading={isFetching}
        beforeTable={beforeTable}
        showSearch={false}
        scrollX={720}
      />

      <Dialog
        open={selected !== null}
        title="Leave request details"
        okText="Close"
        cancelText="Close"
        onClose={() => setSelected(null)}
        onConfirm={() => setSelected(null)}
      >
        {selected && (
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray">Type</dt>
              <dd className="mt-1 font-semibold text-dark">
                {selected.leavePolicy?.name ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Status</dt>
              <dd className="mt-1">
                <StatusBadge
                  variant={leaveRequestStatusVariants[selected.status]}
                >
                  {leaveRequestStatusLabels[selected.status]}
                </StatusBadge>
              </dd>
            </div>
            <div>
              <dt className="text-gray">Dates</dt>
              <dd className="mt-1 font-semibold text-dark">
                {formatLeaveRequestDates(selected.fromDate, selected.toDate)}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Duration</dt>
              <dd className="mt-1 font-semibold text-dark">
                {selected.isHalfDay
                  ? "Half day"
                  : leaveRequestDaysLabel(selected.totalDays)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-gray">Reason</dt>
              <dd className="mt-1 text-dark">{selected.reason}</dd>
            </div>
            {selected.contactDuringLeave && (
              <div>
                <dt className="text-gray">Contact during leave</dt>
                <dd className="mt-1 font-semibold text-dark">
                  {selected.contactDuringLeave}
                </dd>
              </div>
            )}
            {selected.substituteTeacher && (
              <div>
                <dt className="text-gray">Suggested substitute</dt>
                <dd className="mt-1 font-semibold text-dark">
                  {formatTeacherName(selected.substituteTeacher)}
                </dd>
              </div>
            )}
            {selected.attachments && selected.attachments.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-gray">Attachments</dt>
                <dd className="mt-1 flex flex-wrap gap-3">
                  {selected.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary underline"
                    >
                      {attachment.name}
                    </a>
                  ))}
                </dd>
              </div>
            )}
            {selected.rejectionReason && (
              <div className="sm:col-span-2">
                <dt className="text-gray">Rejection reason</dt>
                <dd className="mt-1 text-danger">{selected.rejectionReason}</dd>
              </div>
            )}
            {selected.reviewComment && (
              <div className="sm:col-span-2">
                <dt className="text-gray">Review comment</dt>
                <dd className="mt-1 text-dark">{selected.reviewComment}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray">Submitted on</dt>
              <dd className="mt-1 font-semibold text-dark">
                {dayjs(selected.createdAt).format(DISPLAY_DATE)}
              </dd>
            </div>
          </dl>
        )}
      </Dialog>

      <DeleteDialog
        open={cancelTarget !== null}
        title="Cancel leave request?"
        message={
          cancelTarget
            ? `Cancel your ${cancelTarget.leavePolicy?.name ?? "leave"} request for ${formatLeaveRequestDates(
                cancelTarget.fromDate,
                cancelTarget.toDate,
              )}?`
            : "Cancel this leave request?"
        }
        description="The request is marked as Cancelled. Your leave balance stays the same."
        okText="Cancel request"
        cancelText="Keep request"
        confirmLoading={isCancelling}
        onClose={() => {
          if (!isCancelling) setCancelTarget(null);
        }}
        onConfirm={() => void confirmCancel()}
      />
      <SuccessDialog
        open={cancelSuccess !== null}
        title="Leave request cancelled"
        message={cancelSuccess ?? ""}
        onClose={() => setCancelSuccess(null)}
      />
      <ErrorDialog
        open={cancelError !== null}
        title="Unable to cancel leave request"
        message={cancelError ?? ""}
        onClose={() => setCancelError(null)}
      />
    </div>
  );
}
