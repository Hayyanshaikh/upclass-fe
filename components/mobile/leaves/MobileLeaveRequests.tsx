"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { LuChevronRight } from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileRejectLeaveRequestSheet from "@/components/mobile/leaves/MobileRejectLeaveRequestSheet";
import MobileReviewLeaveRequestSheet from "@/components/mobile/leaves/MobileReviewLeaveRequestSheet";
import MobileList from "@/components/mobile/ui/MobileList";
import {
  getLeaveRequestsControllerFindAllQueryKey,
  useLeaveRequestsControllerApprove,
  useLeaveRequestsControllerCancel,
  useLeaveRequestsControllerFindAll,
  useLeaveRequestsControllerFindOne,
  useLeaveRequestsControllerReject,
} from "@/app/api/endpoints";
import type {
  LeaveRequestDto,
  LeaveRequestsControllerFindAllStatus,
} from "@/app/api/schemas";
import { useLeavePolicyDropdown } from "@/hooks/useLeavePolicyDropdown";
import { pendingLeaveRequestsQuery } from "@/hooks/usePendingLeaveRequestCount";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTable } from "@/hooks/useTable";
import {
  formatLeaveRequestDates,
  formatTeacherName,
  getLeaveRequestErrorMessage,
  leaveRequestDaysLabel,
  leaveRequestStatusLabels,
  leaveRequestStatusOptions,
  leaveRequestStatusVariants,
} from "@/lib/api/leave-requests";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type LeaveRequestFilters = {
  leavePolicyId?: string;
  status?: LeaveRequestsControllerFindAllStatus;
  month?: string;
};

type LeaveSheet = "review" | "reject" | "cancel" | null;

const monthOptions = Array.from({ length: 6 }, (_, index) => {
  const month = dayjs().subtract(index, "month");
  return { label: month.format("MMM YYYY"), value: month.format("YYYY-MM") };
});

function mergeRows(current: LeaveRequestDto[], incoming: LeaveRequestDto[]) {
  const seen = new Set(current.map((request) => request.id));
  return [...current, ...incoming.filter((request) => !seen.has(request.id))];
}

function RequestCardBody({ request }: { request: LeaveRequestDto }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-dark">
          {formatTeacherName(request.teacher)}
        </p>
        <StatusBadge variant={leaveRequestStatusVariants[request.status]}>
          {leaveRequestStatusLabels[request.status]}
        </StatusBadge>
      </div>
      <p className="mt-0.5 truncate text-xs text-gray">
        {request.teacher?.employeeId ?? "—"} ·{" "}
        {request.leavePolicy?.name ?? "—"}
      </p>
      <p className="mt-0.5 truncate text-xs text-gray">
        {formatLeaveRequestDates(request.fromDate, request.toDate)} ·{" "}
        {request.isHalfDay
          ? "Half day"
          : leaveRequestDaysLabel(request.totalDays)}
      </p>
    </div>
  );
}

export default function MobileLeaveRequests() {
  const { canView, canEdit } = useRolePermission("leave_requests");
  const [rows, setRows] = useState<LeaveRequestDto[]>([]);
  const [selected, setSelected] = useState<LeaveRequestDto | null>(null);
  const [sheet, setSheet] = useState<LeaveSheet>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<LeaveRequestFilters>({ pageSize: 10, debounceMs: 400 });

  const { options: policyOptions } = useLeavePolicyDropdown();

  const { data, isFetching, isError, refetch } =
    useLeaveRequestsControllerFindAll({
      limit: pageSize,
      offset,
      searchKey: search || undefined,
      leavePolicyId: filters.leavePolicyId,
      status: filters.status,
      month: filters.month,
    });

  const { data: detail, isFetching: isDetailLoading } =
    useLeaveRequestsControllerFindOne(selected?.id ?? "", {
      query: { enabled: selected !== null && sheet === "review" },
    });

  const { mutateAsync: approveRequest, isPending: isApproving } =
    useLeaveRequestsControllerApprove();
  const { mutateAsync: rejectRequest, isPending: isRejecting } =
    useLeaveRequestsControllerReject();
  const { mutateAsync: cancelRequest, isPending: isCancelling } =
    useLeaveRequestsControllerCancel();

  const isSubmitting = isApproving || isRejecting || isCancelling;
  const queryClient = useQueryClient();

  const responseData = data?.data;
  const total = data?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!responseData) return;
    setRows((previous) =>
      page === 1 ? responseData : mergeRows(previous, responseData),
    );
  }, [responseData, page]);

  function refreshPendingCount() {
    void queryClient.invalidateQueries({
      queryKey: getLeaveRequestsControllerFindAllQueryKey(
        pendingLeaveRequestsQuery,
      ),
    });
  }

  function refreshFromFirstPage() {
    if (page > 1) {
      setPage(1);
      return;
    }
    void refetch();
  }

  function openReview(request: LeaveRequestDto) {
    setSelected(request);
    setSheet("review");
  }

  async function handleApprove(comment?: string) {
    if (!selected || isApproving) return;
    const teacher = formatTeacherName(selected.teacher);

    try {
      await approveRequest({
        id: selected.id,
        data: { comment: comment?.trim() || undefined },
      });
      setSheet(null);
      refreshPendingCount();
      refreshFromFirstPage();
      setFeedback({
        tone: "success",
        message: `${teacher}'s leave request was approved and attendance is marked as leave.`,
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: getLeaveRequestErrorMessage(
          error,
          "Unable to approve this leave request.",
        ),
      });
    }
  }

  async function handleReject(reason: string) {
    if (!selected || isRejecting) return;
    const teacher = formatTeacherName(selected.teacher);

    try {
      await rejectRequest({ id: selected.id, data: { reason } });
      setSheet(null);
      refreshPendingCount();
      refreshFromFirstPage();
      setFeedback({
        tone: "success",
        message: `${teacher}'s leave request was rejected.`,
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: getLeaveRequestErrorMessage(
          error,
          "Unable to reject this leave request.",
        ),
      });
    }
  }

  async function handleCancel() {
    if (!selected || isCancelling) return;
    const teacher = formatTeacherName(selected.teacher);

    try {
      await cancelRequest({ id: selected.id });
      setSheet(null);
      refreshPendingCount();
      refreshFromFirstPage();
      setFeedback({
        tone: "success",
        message: `${teacher}'s leave request was cancelled.`,
      });
    } catch (error) {
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
    <div className="flex flex-col gap-4 pb-4">
      <h1 className="text-lg font-bold text-dark">Leave requests</h1>

      <MobileList
        items={rows}
        rowKey={(request) => request.id}
        renderItem={(request) =>
          canView ? (
            <button
              type="button"
              aria-label={`Review ${formatTeacherName(request.teacher)}'s leave request`}
              onClick={() => openReview(request)}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
            >
              <RequestCardBody request={request} />
              <LuChevronRight
                size={18}
                className="shrink-0 text-gray"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-4">
              <RequestCardBody request={request} />
            </div>
          )
        }
        search={{
          placeholder: "Search by teacher name or employee ID",
          onChange: setSearch,
        }}
        filters={{
          fields: [
            {
              name: "leavePolicyId",
              label: "Leave type",
              placeholder: "Any type",
              options: policyOptions,
            },
            {
              name: "status",
              label: "Status",
              placeholder: "Any status",
              options: leaveRequestStatusOptions,
            },
            {
              name: "month",
              label: "Month",
              placeholder: "Any month",
              options: monthOptions,
            },
          ],
          values: filters,
          onApply: setFilters,
        }}
        loading={isFetching && rows.length === 0 && !isError}
        loadingMore={isFetching && rows.length > 0}
        error={isError && rows.length === 0}
        onRetry={() => void refetch()}
        hasMore={page < lastPage && rows.length > 0}
        onLoadMore={() => setPage(page + 1)}
        emptyText="No leave requests found."
      />

      <MobileReviewLeaveRequestSheet
        open={sheet === "review"}
        request={selected}
        balanceAfterApproval={
          isDetailLoading ? undefined : detail?.balanceAfterApproval
        }
        canEdit={canEdit}
        isApproving={isApproving}
        isSubmitting={isSubmitting}
        onClose={() => setSheet(null)}
        onApprove={(comment) => void handleApprove(comment)}
        onReject={() => setSheet("reject")}
        onCancelRequest={() => setSheet("cancel")}
      />

      <MobileRejectLeaveRequestSheet
        open={sheet === "reject"}
        request={selected}
        isSubmitting={isRejecting}
        onClose={() => setSheet("review")}
        onReject={(reason) => void handleReject(reason)}
      />

      <MobileConfirmDialog
        open={sheet === "cancel"}
        title="Cancel this request?"
        description={
          selected
            ? `${formatTeacherName(selected.teacher)}'s ${selected.leavePolicy?.name ?? "leave"} request for ${formatLeaveRequestDates(selected.fromDate, selected.toDate)} is still pending. If you cancel it, the request is marked as Cancelled and attendance stays unchanged.`
            : "Cancel this leave request?"
        }
        confirmText="Cancel request"
        cancelText="Keep request"
        danger
        confirmLoading={isCancelling}
        onConfirm={() => void handleCancel()}
        onClose={() => {
          if (!isCancelling) setSheet("review");
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
