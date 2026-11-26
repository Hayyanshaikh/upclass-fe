"use client";

import { useState } from "react";
import { LuChevronRight, LuPlus } from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileApplyLeaveForm from "@/components/mobile/forms/MobileApplyLeaveForm";
import MobileMyLeaveRequestSheet from "@/components/mobile/leaves/MobileMyLeaveRequestSheet";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import {
  useLeaveRequestsControllerCancelMy,
  useLeaveRequestsControllerMyRequests,
} from "@/app/api/endpoints";
import type { LeaveRequestDto } from "@/app/api/schemas";
import { useRolePermission } from "@/hooks/useRolePermission";
import {
  formatLeaveRequestDates,
  getLeaveRequestErrorMessage,
  leaveRequestDaysLabel,
  leaveRequestStatusLabels,
  leaveRequestStatusVariants,
} from "@/lib/api/leave-requests";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

function MyRequestCardBody({ request }: { request: LeaveRequestDto }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-dark">
          {request.leavePolicy?.name ?? "Leave"}
        </p>
        <StatusBadge variant={leaveRequestStatusVariants[request.status]}>
          {leaveRequestStatusLabels[request.status]}
        </StatusBadge>
      </div>
      <p className="mt-0.5 truncate text-xs text-gray">
        {formatLeaveRequestDates(request.fromDate, request.toDate)} ·{" "}
        {request.isHalfDay
          ? "Half day"
          : leaveRequestDaysLabel(request.totalDays)}
      </p>
      {request.rejectionReason && (
        <p className="mt-0.5 truncate text-xs text-danger">
          {request.rejectionReason}
        </p>
      )}
    </div>
  );
}

export default function MobileTeacherLeaves() {
  const [selected, setSelected] = useState<LeaveRequestDto | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const { canCreate, canEdit } = useRolePermission("teacher_leaves");

  const requestsQuery = useLeaveRequestsControllerMyRequests();
  const { mutateAsync: cancelMy, isPending: isCancelling } =
    useLeaveRequestsControllerCancelMy();

  const requests = requestsQuery.data?.data ?? [];

  function openDetails(request: LeaveRequestDto) {
    setSelected(request);
    setDetailsOpen(true);
  }

  function handleApplied(message: string) {
    setApplyOpen(false);
    setFeedback({ tone: "success", message });
    void requestsQuery.refetch();
  }

  async function confirmCancel() {
    if (!selected || isCancelling) return;

    const label = `${selected.leavePolicy?.name ?? "Leave"} · ${formatLeaveRequestDates(
      selected.fromDate,
      selected.toDate,
    )}`;

    try {
      await cancelMy({ id: selected.id });
      await requestsQuery.refetch();
      setCancelOpen(false);
      setDetailsOpen(false);
      setFeedback({
        tone: "success",
        message: `Your leave request (${label}) was cancelled.`,
      });
    } catch (error) {
      setCancelOpen(false);
      setFeedback({
        tone: "error",
        message: getLeaveRequestErrorMessage(
          error,
          "Unable to cancel this leave request.",
        ),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-lg font-bold text-dark">Teacher leaves</h1>

      <MobileList
        items={requests}
        rowKey={(request) => request.id}
        renderItem={(request) => (
          <button
            type="button"
            aria-label="View leave request details"
            onClick={() => openDetails(request)}
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
          >
            <MyRequestCardBody request={request} />
            <LuChevronRight
              size={18}
              className="shrink-0 text-gray"
              aria-hidden="true"
            />
          </button>
        )}
        loading={requestsQuery.isPending && !requestsQuery.isError}
        error={requestsQuery.isError}
        onRetry={() => void requestsQuery.refetch()}
        emptyText="No leave requests yet."
      />

      {canCreate && (
        <MobileIconButton
          variant="fab"
          label="Apply leave"
          onClick={() => setApplyOpen(true)}
        >
          <LuPlus size={24} aria-hidden="true" />
        </MobileIconButton>
      )}

      <MobileApplyLeaveForm
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onSaved={handleApplied}
      />

      <MobileMyLeaveRequestSheet
        open={detailsOpen}
        request={selected}
        canEdit={canEdit}
        onClose={() => setDetailsOpen(false)}
        onCancelRequest={() => setCancelOpen(true)}
      />

      <MobileConfirmDialog
        open={cancelOpen}
        title="Cancel leave request?"
        description={
          selected
            ? `Cancel your ${selected.leavePolicy?.name ?? "leave"} request for ${formatLeaveRequestDates(
                selected.fromDate,
                selected.toDate,
              )}? Your leave balance stays the same.`
            : "Cancel this leave request?"
        }
        confirmText="Cancel request"
        cancelText="Keep request"
        danger
        confirmLoading={isCancelling}
        onConfirm={() => void confirmCancel()}
        onClose={() => {
          if (!isCancelling) setCancelOpen(false);
        }}
      />

      <MobileFeedbackDialog
        open={feedback !== null}
        tone={feedback?.tone ?? "success"}
        message={feedback?.message ?? ""}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
